import { test, expect } from '@playwright/test';
import { resetDatabase } from './helpers/test-utils';

test.describe('Cenário 2: Acesso direto ao detalhe, 404 amigável e limite de edições', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve acessar detalhe direto via URL e verificar metadados e limites de quantidade', async ({
    page,
  }) => {
    // 1. Acesso direto com ID válido
    await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });

    // Verifica elementos da página de detalhe visíveis
    await expect(page.locator('h1').filter({ visible: true }).first()).toContainText('Emerald Ape #042');
    await expect(page.locator('text=1.19 ETH').filter({ visible: true }).first()).toBeVisible();

    // 2. Limite inferior de quantidade (mínimo 1, botão "-" desabilitado)
    const minusBtn = page.locator('button[aria-label="Diminuir quantidade"]').filter({ visible: true }).first();
    await expect(minusBtn).toBeDisabled();

    // 3. Seletor de edição e limite superior de quantidade
    // Clica na edição 1/1
    const edition1of1Btn = page.locator('button:has-text("1/1")').filter({ visible: true }).first();
    if (await edition1of1Btn.isVisible()) {
      await edition1of1Btn.click();
      await page.waitForTimeout(200);

      // Com edição 1/1, o botão "+" deve estar desabilitado já que a quantidade 1 atinge o limite
      const plusBtn = page.locator('button[aria-label="Aumentar quantidade"]').filter({ visible: true }).first();
      await expect(plusBtn).toBeDisabled();
    }
  });

  test('deve tratar NFT inexistente exibindo tela 404 amigável com retorno ao catálogo', async ({
    page,
  }) => {
    // Acessa NFT inexistente
    await page.goto('/nfts/nft_inexistente_9999', { waitUntil: 'networkidle' });

    // Verifica mensagem de erro amigável
    await expect(page.locator('text=NFT Não Encontrado').filter({ visible: true })).toBeVisible();

    // Verifica link de volta ao catálogo
    const backBtn = page
      .locator('a:has-text("Voltar para o Mercado"), a:has-text("Voltar ao catálogo"), a:has-text("Voltar ao início")')
      .filter({ visible: true })
      .first();
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).not.toContain('nft_inexistente');
  });
});
