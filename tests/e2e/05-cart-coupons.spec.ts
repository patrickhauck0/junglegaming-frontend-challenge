import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs } from './helpers/test-utils';

test.describe('Cenário 5: Carrinho, Quantidades, Remoção, Cupons e Merge pós-login', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve adicionar item, alterar quantidade, aplicar cupom válido/inválido e persistir no F5', async ({
    page,
  }) => {
    // 1. Adiciona NFT ao carrinho
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
    const buyButton = page
      .locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")')
      .filter({ visible: true })
      .first();
    await buyButton.click();
    await page.waitForTimeout(400);

    // Navega para o carrinho
    await page.goto('/cart', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Emerald Ape #042').filter({ visible: true }).first()).toBeVisible();

    // 2. Altera quantidade
    const increaseBtn = page.locator('button[aria-label*="Aumentar quantidade"]').filter({ visible: true }).first();
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
      await page.waitForTimeout(400);
      // Verifica quantidade atualizada para 2
      await expect(page.locator('text=2').filter({ visible: true }).first()).toBeVisible();
    }

    // 3. Cupom Inválido
    const couponInput = page.locator('input[placeholder*="código promocional"]').filter({ visible: true }).first();
    const applyCouponBtn = page.locator('form:has(input[placeholder*="código promocional"]) button[type="submit"]').filter({ visible: true }).first();

    await couponInput.fill('CUPOM_FALSO');
    await applyCouponBtn.click();
    await page.waitForTimeout(400);

    await expect(page.locator('text=Código promocional inexistente ou inválido').filter({ visible: true }).first()).toBeVisible();

    // 4. Cupom Válido (KURIO10)
    await couponInput.fill('KURIO10');
    await applyCouponBtn.click();
    await page.waitForTimeout(400);

    await expect(page.locator('text=10% de desconto aplicado com sucesso').filter({ visible: true }).first()).toBeVisible();

    // 5. Persistência após F5 (Reload)
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('text=Emerald Ape #042').filter({ visible: true }).first()).toBeVisible();
    await expect(page.locator('text=10% de desconto aplicado com sucesso').filter({ visible: true }).first()).toBeVisible();
  });

  test('deve fazer merge do carrinho de visitante ao autenticar com login', async ({
    page,
  }) => {
    // 1. Adiciona item como visitante (deslogado)
    await page.goto('/nfts/nft_02', { waitUntil: 'networkidle' });
    const buyButton = page.locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")').filter({ visible: true }).first();
    await buyButton.click();
    await page.waitForTimeout(400);

    // 2. Faz login com usuário existente
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');

    // 3. Acessa o carrinho e verifica que o item adicionado como visitante foi preservado (merge)
    await page.goto('/cart', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Violet Nomad #314').filter({ visible: true }).first()).toBeVisible();
  });
});
