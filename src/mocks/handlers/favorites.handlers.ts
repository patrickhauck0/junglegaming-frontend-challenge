import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb } from '../db';
import { getScenarioConfig } from '../scenarios';

function extractUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/token_(user_[^_\s]+)/);
  return match ? match[1] ?? null : null;
}

export const favoritesHandlers = [
  http.get('/api/favorites', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para ver favoritos' }, { status: 401 });
    }

    const db = getDb();
    const favIds = db.favorites[userId] || [];
    const favoritedNfts = db.nfts.filter((nft) => favIds.includes(nft.id));

    return HttpResponse.json({ data: favoritedNfts });
  }),

  http.post('/api/favorites/:nftId', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    if (scenario.errorMode === '500') {
      return HttpResponse.json({ error: 'InternalServerError', message: 'Falha simulada ao favoritar NFT' }, { status: 500 });
    }

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para favoritar' }, { status: 401 });
    }

    const { nftId } = params as { nftId: string };
    const db = getDb();
    if (!db.favorites[userId]) {
      db.favorites[userId] = [];
    }

    if (!db.favorites[userId].includes(nftId)) {
      db.favorites[userId].push(nftId);
      const nft = db.nfts.find((n) => n.id === nftId);
      if (nft) {
        nft.likesCount += 1;
      }
      saveDb(db);
    }

    return HttpResponse.json({ success: true, nftId, isFavorited: true });
  }),

  http.delete('/api/favorites/:nftId', async ({ request, params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    if (scenario.errorMode === '500') {
      return HttpResponse.json({ error: 'InternalServerError', message: 'Falha simulada ao desfavoritar NFT' }, { status: 500 });
    }

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Faça login para gerenciar favoritos' }, { status: 401 });
    }

    const { nftId } = params as { nftId: string };
    const db = getDb();
    if (db.favorites[userId]) {
      db.favorites[userId] = db.favorites[userId].filter((id) => id !== nftId);
      const nft = db.nfts.find((n) => n.id === nftId);
      if (nft && nft.likesCount > 0) {
        nft.likesCount -= 1;
      }
      saveDb(db);
    }

    return HttpResponse.json({ success: true, nftId, isFavorited: false });
  }),
];
