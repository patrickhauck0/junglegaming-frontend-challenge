import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs, emitNftUpdated } from './helpers/test-utils';

test.describe('Cenário 9: Tempo Real no Checkout (nft.updated), Alerta e Bloqueio de Cotação Obsoleta', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve detectar alteração de preço em tempo real no checkout, exibir alerta e bloquear envio até revisão', async ({
    page,
  }) => {
    // 1. Adiciona NFT e avança para a tela de pagamento
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
    const buyButton = page
      .locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")')
      .filter({ visible: true })
      .first();
    await buyButton.click();
    await page.waitForTimeout(400);

    await page.goto('/cart', { waitUntil: 'networkidle' });
    const checkoutButton = page
      .locator('button:has-text("Conectar e finalizar")')
      .filter({ visible: true })
      .first();
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();
    await page.waitForURL(/\/payment/, { waitUntil: 'networkidle' });
    const confirmButton = page.locator('button:has-text("Confirmar compra")').filter({ visible: true }).first();
    await expect(confirmButton).toBeEnabled();

    // 2. Dispara evento WebSocket nft.updated alterando o preço de nft_01
    await emitNftUpdated(page, {
      nftId: 'nft_01',
      priceEth: '3.50',
    });
    await page.waitForTimeout(600);

    // 3. Verifica exibição do alerta na interface
    await expect(page.locator('text=Cotação atualizada na rede').filter({ visible: true })).toBeVisible();

    // 4. Verifica que o botão de confirmação foi bloqueado
    await expect(confirmButton).toBeDisabled();

    // 5. Clica para revisar e aceitar nova cotação
    const reviewBtn = page.locator('button:has-text("aceitar nova cotação"), button:has-text("Aceitar nova cotação")').filter({ visible: true }).first();
    await reviewBtn.click();
    await page.waitForTimeout(300);

    // 6. Alerta fecha e botão é liberado novamente
    await expect(page.locator('text=Cotação atualizada na rede').filter({ visible: true })).not.toBeVisible();
    await expect(confirmButton).toBeEnabled();
  });
});
