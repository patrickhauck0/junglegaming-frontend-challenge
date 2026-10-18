import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb } from '../db';
import { getScenarioConfig } from '../scenarios';
import { addEth, multiplyEthByQuantity } from '@/utils/eth-math';
import type { CartItem } from '@/contracts/cart';

function getSessionCartKey(request: Request): string {
  const auth = request.headers.get('Authorization');
  if (auth) {
    const match = auth.match(/token_(user_[^_\s]+)/);
    if (match?.[1]) return match[1];
  }
  const guestHeader = request.headers.get('X-Guest-Id');
  return guestHeader || 'guest';
}

function calculateCartSubtotal(items: CartItem[]): string {
  return items.reduce((acc, item) => {
    const itemTotal = multiplyEthByQuantity(item.priceEth, item.quantity);
    return addEth(acc, itemTotal);
  }, '0.00');
}

export const cartHandlers = [
  http.get('/api/cart', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const cartKey = getSessionCartKey(request);
    const db = getDb();
    const items = db.carts[cartKey] || [];

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalEth = calculateCartSubtotal(items);

    return HttpResponse.json({
      userId: cartKey.startsWith('user_') ? cartKey : undefined,
      items,
      totalItems,
      subtotalEth,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const body = (await request.json()) as { nftId?: string; quantity?: number };
    const { nftId, quantity = 1 } = body;

    if (!nftId || quantity < 1) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Item ou quantidade inválida' }, { status: 400 });
    }

    const db = getDb();
    const nft = db.nfts.find((n) => n.id === nftId);
    if (!nft) {
      return HttpResponse.json({ error: 'NotFound', message: 'NFT não encontrado' }, { status: 404 });
    }

    if (nft.availableEditions <= 0) {
      return HttpResponse.json({ error: 'Conflict', message: 'Edição esgotada para este NFT' }, { status: 409 });
    }

    const cartKey = getSessionCartKey(request);
    if (!db.carts[cartKey]) {
      db.carts[cartKey] = [];
    }

    const existingIndex = db.carts[cartKey]!.findIndex((item) => item.nftId === nftId);
    const currentQty = existingIndex >= 0 ? db.carts[cartKey]![existingIndex]!.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > nft.availableEditions) {
      return HttpResponse.json(
        {
          error: 'Conflict',
          message: `Quantidade solicitada (${targetQty}) excede o limite disponível de edições (${nft.availableEditions})`,
        },
        { status: 409 }
      );
    }

    if (existingIndex >= 0) {
      db.carts[cartKey]![existingIndex]!.quantity = targetQty;
      db.carts[cartKey]![existingIndex]!.priceEth = nft.priceEth;
    } else {
      db.carts[cartKey]!.push({
        nftId: nft.id,
        nft,
        quantity: targetQty,
        priceEth: nft.priceEth,
      });
    }

    saveDb(db);

    const items = db.carts[cartKey]!;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotalEth = calculateCartSubtotal(items);

    return HttpResponse.json({
      userId: cartKey.startsWith('user_') ? cartKey : undefined,
      items,
      totalItems,
      subtotalEth,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.patch('/api/cart/items/:nftId', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const { nftId } = params as { nftId: string };
    const body = (await request.json()) as { quantity?: number };
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Quantidade deve ser maior que zero' }, { status: 400 });
    }

    const db = getDb();
    const nft = db.nfts.find((n) => n.id === nftId);
    if (!nft) {
      return HttpResponse.json({ error: 'NotFound', message: 'NFT não encontrado' }, { status: 404 });
    }

    if (quantity > nft.availableEditions) {
      return HttpResponse.json(
        {
          error: 'Conflict',
          message: `Limite de edições excedido (${quantity} > ${nft.availableEditions})`,
        },
        { status: 409 }
      );
    }

    const cartKey = getSessionCartKey(request);
    const items = db.carts[cartKey] || [];
    const item = items.find((i) => i.nftId === nftId);

    if (!item) {
      return HttpResponse.json({ error: 'NotFound', message: 'Item não encontrado no carrinho' }, { status: 404 });
    }

    item.quantity = quantity;
    item.priceEth = nft.priceEth;
    saveDb(db);

    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalEth = calculateCartSubtotal(items);

    return HttpResponse.json({
      userId: cartKey.startsWith('user_') ? cartKey : undefined,
      items,
      totalItems,
      subtotalEth,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.delete('/api/cart/items/:nftId', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const { nftId } = params as { nftId: string };
    const cartKey = getSessionCartKey(request);
    const db = getDb();

    if (db.carts[cartKey]) {
      db.carts[cartKey] = db.carts[cartKey]!.filter((i) => i.nftId !== nftId);
      saveDb(db);
    }

    const items = db.carts[cartKey] || [];
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalEth = calculateCartSubtotal(items);

    return HttpResponse.json({
      userId: cartKey.startsWith('user_') ? cartKey : undefined,
      items,
      totalItems,
      subtotalEth,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.post('/api/cart/merge', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const auth = request.headers.get('Authorization');
    if (!auth) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Autenticação necessária para merge' }, { status: 401 });
    }

    const match = auth.match(/token_(user_[^_\s]+)/);
    const userId = match?.[1];
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Usuário inválido' }, { status: 401 });
    }

    let guestItems: CartItem[] = [];
    try {
      const body = (await request.json()) as { guestItems?: CartItem[] };
      if (body?.guestItems && Array.isArray(body.guestItems)) {
        guestItems = body.guestItems;
      }
    } catch {
      // Ignora se não houver body
    }

    const db = getDb();
    if (guestItems.length === 0 && db.carts['guest']) {
      guestItems = db.carts['guest'];
    }

    if (!db.carts[userId]) {
      db.carts[userId] = [];
    }

    for (const gItem of guestItems) {
      const nft = db.nfts.find((n) => n.id === gItem.nftId);
      if (!nft || nft.availableEditions <= 0) continue;

      const existing = db.carts[userId]!.find((i) => i.nftId === gItem.nftId);
      if (existing) {
        existing.quantity = Math.min(nft.availableEditions, existing.quantity + gItem.quantity);
        existing.priceEth = nft.priceEth;
      } else {
        db.carts[userId]!.push({
          ...gItem,
          quantity: Math.min(nft.availableEditions, gItem.quantity),
          priceEth: nft.priceEth,
          nft,
        });
      }
    }

    // Limpa carrinho de visitante após merge bem-sucedido
    db.carts['guest'] = [];
    saveDb(db);

    const items = db.carts[userId]!;
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalEth = calculateCartSubtotal(items);

    return HttpResponse.json({
      userId,
      items,
      totalItems,
      subtotalEth,
      updatedAt: new Date().toISOString(),
    });
  }),

  http.post('/api/cart/coupon', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    let code = '';
    try {
      const body = (await request.json()) as { code?: string };
      code = body?.code || '';
    } catch {
      return HttpResponse.json({ error: 'BadRequest', message: 'Payload inválido' }, { status: 400 });
    }

    if (!code.trim()) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Informe o código do cupom.' }, { status: 400 });
    }

    const clean = code.trim().toUpperCase();
    const db = getDb();
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === clean);

    if (!coupon) {
      return HttpResponse.json(
        { error: 'CouponNotFound', message: 'Código promocional inexistente ou inválido.' },
        { status: 400 }
      );
    }

    if (coupon.isExpired || !coupon.isValid) {
      return HttpResponse.json(
        { error: 'CouponExpired', message: 'Este código promocional expirou.' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        description: coupon.description,
      },
      message: `${coupon.discountPercent}% de desconto aplicado com sucesso!`,
    });
  }),

  http.delete('/api/cart/coupon', async () => {
    return HttpResponse.json({
      success: true,
      message: 'Cupom removido com sucesso.',
    });
  }),
];
