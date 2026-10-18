import { http, HttpResponse } from 'msw';
import { resetDb } from '../db';
import { setScenarioConfig, resetScenarioConfig, type ScenarioConfig } from '../scenarios';
import { broadcastNftUpdated, broadcastOrderUpdated } from '../ws';

export const testHandlers = [
  http.post('/api/__test__/reset', async ({ request }) => {
    let scenarioParam: string | undefined;
    try {
      const body = (await request.json()) as { scenario?: string };
      scenarioParam = body?.scenario;
    } catch {
      // Ignora erro se não houver body
    }

    const freshDb = resetDb(scenarioParam);
    resetScenarioConfig();

    return HttpResponse.json({
      success: true,
      message: 'Base de dados do MSW e configurações de cenário restauradas com sucesso',
      totalNfts: freshDb.nfts.length,
      totalUsers: freshDb.users.length,
    });
  }),

  http.post('/api/__test__/scenario', async ({ request }) => {
    const body = (await request.json()) as Partial<ScenarioConfig>;
    const updated = setScenarioConfig(body);
    return HttpResponse.json({
      success: true,
      scenario: updated,
    });
  }),

  http.post('/api/__test__/emit-nft-updated', async ({ request }) => {
    const body = (await request.json()) as { nftId: string; priceEth?: string; availableEditions?: number };
    const event = broadcastNftUpdated(body.nftId, body.priceEth, body.availableEditions);
    return HttpResponse.json({ success: true, event });
  }),

  http.post('/api/__test__/emit-order-updated', async ({ request }) => {
    const body = (await request.json()) as { orderId: string; status: 'confirmed' | 'declined'; userId?: string };
    const event = broadcastOrderUpdated(body.orderId, body.status, body.userId);
    return HttpResponse.json({ success: true, event });
  }),
];
