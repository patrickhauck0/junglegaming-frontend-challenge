import { test, expect } from '@playwright/test';
import { resetDatabase } from './helpers/test-utils';

test.describe('Cenário 11: Acessibilidade, Navegação por Teclado, Escape e Semântica de Foco', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve navegar por Tab, acionar e fechar modal por Escape e manter semântica acessível', async ({
    page,
  }) => {
    // 1. Navega para a Home
    await page.goto('/', { waitUntil: 'networkidle' });

    // Pressiona Tab sucessivamente para garantir foco visível em links e botões
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);

    // 2. Navega para Detalhes e testa modal de Zoom / Escape
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });

    const zoomButton = page.locator('button[aria-label*="zoom"], button[aria-label*="alta resolução"]').first();
    if (await zoomButton.isVisible()) {
      await zoomButton.click();
      await page.waitForTimeout(300);

      // Modal visível
      const modal = page.locator('div[role="dialog"]').first();
      await expect(modal).toBeVisible();

      // Pressiona Escape para fechar
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(modal).not.toBeVisible();
    }

    // 3. Verifica labels e acessibilidade em formulário de login
    await page.goto('/login', { waitUntil: 'networkidle' });
    const emailInput = page.locator('input#login-email, input[type="text"]').filter({ visible: true }).first();
    await expect(emailInput).toBeVisible();
    const hasLabel = Boolean(await emailInput.getAttribute('aria-label')) || (await page.locator('label[for="login-email"]').count()) > 0;
    expect(hasLabel).toBeTruthy();
  });
});
