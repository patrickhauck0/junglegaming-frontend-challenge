import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb } from '../db';
import { getScenarioConfig } from '../scenarios';
import type { Wallet } from '@/contracts/wallet';

function extractUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/token_(user_[^_\s]+)/);
  return match ? match[1] ?? null : null;
}

export const walletHandlers = [
  http.get('/api/wallets', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para ver suas carteiras' }, { status: 401 });
    }

    const db = getDb();
    const userWallets = db.wallets.filter((w) => w.userId === userId);
    return HttpResponse.json({ data: userWallets });
  }),

  http.post('/api/wallets', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para adicionar carteiras' }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; address?: string; network?: 'Ethereum' | 'Polygon' | 'Solana'; isPrimary?: boolean };
    const { name, address, network = 'Ethereum', isPrimary = false } = body;

    if (!name || !address) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Nome e endereço são obrigatórios' }, { status: 400 });
    }

    const db = getDb();
    if (isPrimary) {
      db.wallets.forEach((w) => {
        if (w.userId === userId) w.isPrimary = false;
      });
    }

    const newWallet: Wallet = {
      id: `w_${Date.now()}`,
      userId,
      name,
      address,
      network,
      isPrimary,
      isConnected: true,
      balanceEth: '5.00',
    };

    db.wallets.push(newWallet);
    saveDb(db);

    return HttpResponse.json(newWallet, { status: 201 });
  }),

  http.patch('/api/wallets/:id', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const { id } = params as { id: string };
    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para atualizar carteiras' }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; isPrimary?: boolean; isConnected?: boolean };
    const db = getDb();
    const wallet = db.wallets.find((w) => w.id === id && w.userId === userId);

    if (!wallet) {
      return HttpResponse.json({ error: 'NotFound', message: 'Carteira não encontrada' }, { status: 404 });
    }

    if (body.isPrimary) {
      db.wallets.forEach((w) => {
        if (w.userId === userId) w.isPrimary = false;
      });
      wallet.isPrimary = true;
    }

    if (body.name !== undefined) wallet.name = body.name;
    if (body.isConnected !== undefined) wallet.isConnected = body.isConnected;

    saveDb(db);
    return HttpResponse.json(wallet);
  }),
];
