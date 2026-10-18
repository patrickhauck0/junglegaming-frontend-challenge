import { test, expect } from '@playwright/test';
import { resetDatabase, setScenario, loginAs } from './helpers/test-utils';

test.describe('Cenário 4: Favoritos com Atualização Otimista, Rollback em Erro 500 e Recuperação', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve aplicar atualização otimista imediata, reverter em erro 500 e recuperar após restauração', async ({
    page,
  }) => {
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });

    const favButton = page.getByTestId('detail-favorite-btn').filter({ visible: true });
    await expect(favButton).toBeVisible();

    // 1. Atualização otimista bem-sucedida (coração fica preenchido imediatamente)
    const step1Response = page.waitForResponse(
      (res) => res.url().includes('/api/favorites') && res.status() === 200
    );
    await favButton.click();
    await expect(favButton.locator('svg')).toHaveAttribute('fill', '#D28A4C');
    await step1Response;

    // 2. Simula falha 500 no servidor
    await setScenario(page, { errorMode: '500' });
    await page.waitForTimeout(100);

    // Clica novamente (tentativa de desfavoritar) sob erro 500
    const step2Response = page.waitForResponse(
      (res) => res.url().includes('/api/favorites') && res.status() === 500
    );
    await favButton.click();
    await step2Response;

    // Deve reverter para o estado anterior via rollback (continua preenchido)
    await expect(favButton.locator('svg')).toHaveAttribute('fill', '#D28A4C');

    // 3. Recupera o servidor (errorMode: null)
    await setScenario(page, { errorMode: null });
    await page.waitForTimeout(100);

    // Desfavorita com sucesso agora
    const step3Response = page.waitForResponse(
      (res) => res.url().includes('/api/favorites') && res.status() === 200
    );
    await favButton.click();
    await step3Response;
    await expect(favButton.locator('svg')).toHaveAttribute('fill', 'none');
  });
});
