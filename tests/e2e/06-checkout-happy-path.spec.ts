import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs } from './helpers/test-utils';

test.describe('Cenário 6: Compra Completa (Happy Path) do Catálogo ao Recibo Confirmado', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve navegar do catálogo ao carrinho, finalizar compra e exibir recibo confirmado', async ({
    page,
  }) => {
    // 1. Catálogo -> Detalhe
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
    const buyButton = page
      .locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")')
      .filter({ visible: true })
      .first();
    await buyButton.click();
    await page.waitForTimeout(400);

    // 2. Carrinho
    await page.goto('/cart', { waitUntil: 'networkidle' });
    const checkoutButton = page
      .locator('button:has-text("Conectar e finalizar")')
      .filter({ visible: true })
      .first();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    // 3. Tela de Pagamento
    await page.waitForURL((url) => url.pathname.includes('/payment'), { timeout: 8000 });
    await expect(page.locator('h1').filter({ visible: true }).first()).toContainText(/Pagamento|Perfil do colecionador/);

    // Seleciona carteira se necessário
    const coinbaseOption = page.locator('button:has-text("Coinbase Wallet")').filter({ visible: true }).first();
    if (await coinbaseOption.isVisible()) {
      await coinbaseOption.click();
    }

    // Confirma a compra
    const confirmButton = page.locator('button:has-text("Confirmar compra")').filter({ visible: true }).first();
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    // 4. Recibo Confirmado (/orders/:id)
    await page.waitForURL((url) => url.pathname.includes('/orders/'), { timeout: 10000 });
    await expect(page.locator('text=Seus NFTs agora estão na sua carteira').filter({ visible: true }).first()).toBeVisible();

    // Validações do snapshot de confirmação
    await expect(page.locator('text=ID da transação').filter({ visible: true }).first()).toBeVisible();
    await expect(page.locator('text=Detalhes da transação').filter({ visible: true }).first()).toBeVisible();
    await expect(page.locator('button:has-text("Ver no Etherscan")').filter({ visible: true }).first()).toBeVisible();
  });
});
