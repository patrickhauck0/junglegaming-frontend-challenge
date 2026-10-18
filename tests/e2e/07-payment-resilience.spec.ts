import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs, setScenario } from './helpers/test-utils';

test.describe('Cenário 7: Resiliência no Pagamento, Recusa, Prevenção de Duplicação e Idempotência', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve tratar recusa de pagamento preservando itens no carrinho e prevenir cliques duplicados', async ({
    page,
  }) => {
    // 1. Adiciona item e vai para pagamento
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
    await page
      .locator('button:has-text("COMPRAR"), button:has-text("Comprar NFT")')
      .filter({ visible: true })
      .first()
      .click();
    await page.waitForTimeout(300);

    await page.goto('/payment', { waitUntil: 'networkidle' });

    // 2. Configura simulação de pagamento recusado
    await setScenario(page, { paymentMode: 'declined' });

    // 3. Verifica prevenção de clique duplicado
    const confirmButton = page.locator('button:has-text("Confirmar compra")').filter({ visible: true }).first();
    await confirmButton.click();

    // Deve exibir estado de carregamento/desabilitado imediatamente
    const submittingBtn = page.locator('button:has-text("Processando compra...")').filter({ visible: true }).first();
    await expect(submittingBtn).toBeDisabled();

    // 4. Deve redirecionar para a tela de pagamento recusado
    await page.waitForURL((url) => url.pathname.includes('/orders/'), { timeout: 8000 });
    await expect(page.locator('text=Pagamento recusado').filter({ visible: true }).first()).toBeVisible();

    // 5. Clica em "Ver carrinho" e verifica que os itens foram preservados intactos
    const viewCartBtn = page.locator('a:has-text("Ver carrinho")').filter({ visible: true }).first();
    await viewCartBtn.click();

    await page.waitForURL((url) => url.pathname.includes('/cart'), { timeout: 5000 });
    await expect(page.locator('text=Emerald Ape #042').filter({ visible: true }).first()).toBeVisible();
  });
});
