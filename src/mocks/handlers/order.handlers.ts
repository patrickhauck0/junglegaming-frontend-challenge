import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb } from '../db';
import { getScenarioConfig } from '../scenarios';
import { addEth, subtractEth, multiplyEthByQuantity, applyDiscountPercent } from '@/utils/eth-math';
import type { Order, OrderItemSnapshot } from '@/contracts/order';

function extractUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/token_(user_[^_\s]+)/);
  return match ? match[1] ?? null : null;
}

export const orderHandlers = [
  http.post('/api/orders', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const idempotencyKey = request.headers.get('Idempotency-Key');
    if (!idempotencyKey) {
      return HttpResponse.json(
        { error: 'BadRequest', message: 'Header Idempotency-Key é obrigatório para criação de pedidos' },
        { status: 400 }
      );
    }

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para finalizar o pedido' }, { status: 401 });
    }

    const bodyText = await request.text();
    let body: any;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return HttpResponse.json({ error: 'BadRequest', message: 'Corpo da requisição inválido' }, { status: 400 });
    }

    const db = getDb();

    // Idempotência: verificar se a chave já foi usada
    const existingAttempt = db.idempotentOrders[idempotencyKey];
    if (existingAttempt) {
      if (existingAttempt.payloadHash === bodyText) {
        return HttpResponse.json(existingAttempt.order);
      } else {
        return HttpResponse.json(
          {
            error: 'Conflict',
            message: 'A chave de idempotência já foi utilizada com um payload diferente',
          },
          { status: 409 }
        );
      }
    }

    if (scenario.paymentMode === 'timeout') {
      return HttpResponse.json(
        { error: 'GatewayTimeout', message: 'Tempo limite esgotado no gateway de pagamento' },
        { status: 504 }
      );
    }

    const { items = [], couponCode, walletAddress, network = 'Ethereum' } = body;
    if (items.length === 0 || !walletAddress) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Itens e carteira são obrigatórios' }, { status: 400 });
    }

    // Validar disponibilidade e montar snapshot
    let subtotalEth = '0.00';
    const snapshots: OrderItemSnapshot[] = [];

    for (const item of items) {
      const nft = db.nfts.find((n) => n.id === item.nftId);
      if (!nft) {
        return HttpResponse.json({ error: 'NotFound', message: `NFT ${item.nftId} não encontrado` }, { status: 404 });
      }
      if (nft.availableEditions < item.quantity) {
        return HttpResponse.json(
          {
            error: 'Conflict',
            message: `Edições insuficientes para ${nft.title} (${nft.availableEditions} restantes)`,
          },
          { status: 409 }
        );
      }

      const itemTotal = multiplyEthByQuantity(nft.priceEth, item.quantity);
      subtotalEth = addEth(subtotalEth, itemTotal);

      snapshots.push({
        nftId: nft.id,
        title: nft.title,
        imageUrl: nft.imageUrl,
        quantity: item.quantity,
        priceEth: nft.priceEth,
        edition: nft.edition,
      });
    }

    // Desconto de cupom
    let discountEth = '0.00';
    if (couponCode) {
      const coupon = db.coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (coupon && !coupon.isExpired && coupon.isValid) {
        const disc = applyDiscountPercent(subtotalEth, coupon.discountPercent);
        discountEth = disc.discountEth;
      }
    }

    const gasFees: Record<string, string> = { Ethereum: '0.005', Polygon: '0.001', Solana: '0.0005' };
    const gasFeeEth = gasFees[network] || '0.005';
    const subtotalAfterDiscount = subtractEth(subtotalEth, discountEth);
    const totalEth = addEth(subtotalAfterDiscount, gasFeeEth);

    const isPending = scenario.paymentMode === 'pending';
    const isDeclined = scenario.paymentMode === 'declined';
    const orderId = `order_${Date.now()}`;
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newOrder: Order = {
      id: orderId,
      userId,
      status: isPending ? 'pending' : (isDeclined ? 'declined' : 'confirmed'),
      items: snapshots,
      subtotalEth,
      discountEth,
      gasFeeEth,
      totalEth,
      couponCode,
      walletAddress,
      network,
      transactionHash: txHash,
      idempotencyKey,
      createdAt: new Date().toISOString(),
      confirmedAt: (isDeclined || isPending) ? undefined : new Date().toISOString(),
      declinedReason: isDeclined ? 'Pagamento recusado pela carteira do colecionador' : undefined,
    };

    if (!isDeclined) {
      // 1. Deduzir edições dos NFTs
      for (const item of items) {
        const nft = db.nfts.find((n) => n.id === item.nftId);
        if (nft) {
          nft.availableEditions = Math.max(0, nft.availableEditions - item.quantity);
          nft.version += 1;
        }
      }

      // 2. Remover do carrinho APENAS os itens comprados
      if (db.carts[userId]) {
        const purchasedIds = new Set(items.map((i: any) => i.nftId));
        db.carts[userId] = db.carts[userId]!.filter((cItem) => !purchasedIds.has(cItem.nftId));
      }
    }

    db.orders.unshift(newOrder);
    db.idempotentOrders[idempotencyKey] = {
      payloadHash: bodyText,
      order: newOrder,
    };

    saveDb(db);

    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.get('/api/orders', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para ver seus pedidos' }, { status: 401 });
    }

    const db = getDb();
    const userOrders = db.orders.filter((o) => o.userId === userId);
    return HttpResponse.json({ data: userOrders });
  }),

  http.get('/api/orders/:id', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const { id } = params as { id: string };
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para acessar o recibo' }, { status: 401 });
    }

    const db = getDb();
    const order = db.orders.find((o) => o.id === id);
    if (!order) {
      return HttpResponse.json({ error: 'NotFound', message: 'Pedido não encontrado' }, { status: 404 });
    }

    if (order.userId !== userId) {
      return HttpResponse.json(
        { error: 'Forbidden', message: 'Acesso negado a este recibo de compra' },
        { status: 403 }
      );
    }

    return HttpResponse.json(order);
  }),
];
