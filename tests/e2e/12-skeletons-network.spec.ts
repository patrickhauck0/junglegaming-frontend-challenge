import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs, setScenario } from './helpers/test-utils';

test.describe('Cenário 12: Skeletons durante Latência Alta, Erro 500 e Recuperação com Tentar Novamente', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve exibir ShimmerSkeletons com latência simulada e recuperar de erro 500 ao clicar em Tentar novamente', async ({
    page,
  }) => {
    // 1. Simula latência de rede alta (1200ms)
    await setScenario(page, { latencyMs: 1200 });

    // Inicia navegação e verifica presença do esqueleto enquanto carrega
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const skeleton = page.locator('[role="status"]').first();
    await expect(skeleton).toBeVisible({ timeout: 4000 });

    // Aguarda o término do carregamento
    await page.waitForLoadState('networkidle');

    // 2. Simula erro 500 na rota de favoritos com usuário autenticado
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
    await setScenario(page, { errorMode: '500', latencyMs: 100 });

    await page.goto('/favorites', { waitUntil: 'networkidle' });

    // Deve exibir o painel de erro
    await expect(page.locator('text=Erro ao carregar favoritos').first()).toBeVisible({
      timeout: 6000,
    });
    const retryBtn = page.locator('button:has-text("Tentar novamente")').first();
    await expect(retryBtn).toBeVisible();

    // 3. Restaura o servidor para normal e clica em Tentar novamente
    await setScenario(page, { errorMode: null });
    await retryBtn.click();
    await page.waitForTimeout(500);

    // O painel de erro desaparece e o estado normal é renderizado
    await expect(page.locator('text=Erro ao carregar favoritos')).not.toBeVisible();
  });
});
