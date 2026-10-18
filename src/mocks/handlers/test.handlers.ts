import { http, HttpResponse } from 'msw';
import { resetDb } from '../db';
import { setScenarioConfig, resetScenarioConfig, type ScenarioConfig } from '../scenarios';

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
];
