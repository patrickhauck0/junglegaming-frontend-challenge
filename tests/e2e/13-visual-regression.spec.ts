import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs, freezeAnimations } from './helpers/test-utils';

test.describe('Regressão Visual Obrigatória (Desktop & Mobile)', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('regressão visual: Início, Detalhes, Carrinho e Pagamento', async ({ page }, testInfo) => {
    // Apenas executa para Desktop e Mobile (evita redundância em Tablet)
    if (testInfo.project.name === 'Tablet Chromium') {
      test.skip();
    }

    const isMobile = testInfo.project.name.includes('Mobile');
    const prefix = isMobile ? 'mobile' : 'desktop';

    // 1. Início (Home)
    await page.goto('/', { waitUntil: 'networkidle' });
    await freezeAnimations(page);
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot(`${prefix}-home.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });

    // 2. Detalhes do NFT
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
    await freezeAnimations(page);
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot(`${prefix}-nft-details.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });

    // Adiciona ao carrinho para ter itens no Carrinho e Pagamento
    const buyButton = page
      .locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")')
      .filter({ visible: true })
      .first();
    await buyButton.click();
    await page.waitForTimeout(400);

    // 3. Carrinho
    await page.goto('/cart', { waitUntil: 'networkidle' });
    await freezeAnimations(page);
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot(`${prefix}-cart.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });

    // Autentica para ter acesso à tela de pagamento
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');

    // 4. Pagamento
    await page.goto('/payment', { waitUntil: 'networkidle' });
    await freezeAnimations(page);
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot(`${prefix}-payment.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
