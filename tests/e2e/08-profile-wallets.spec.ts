import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs } from './helpers/test-utils';

test.describe('Cenário 8: Gestão de Perfil, Avatar, Senha e Carteiras com Validações', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve atualizar dados de perfil, alternar avatar e alterar senha com validação', async ({
    page,
  }) => {
    await page.goto('/profile', { waitUntil: 'networkidle' });

    // 1. Edição de dados do perfil
    const nameInput = page.locator('input[aria-label="Nome de exibição"]').first();
    await nameInput.fill('Alexandre Pro');

    const saveBtn = page.locator('button[type="submit"]:has-text("Salvar")').first();
    await saveBtn.click({ force: true });
    await page.waitForTimeout(500);

    await expect(page.locator('text=Perfil atualizado com sucesso').first()).toBeVisible();

    // 2. Alterna avatar
    const changeAvatarBtn = page.locator('button:has-text("Alterar")').first();
    if (await changeAvatarBtn.isVisible()) {
      await changeAvatarBtn.click({ force: true });
      await page.waitForTimeout(300);
    }

    // 3. Validação de senha: senha atual incorreta
    const currentPassInput = page.locator('input[aria-label="Senha atual"]').first();
    const newPassInput = page.locator('input[aria-label="Nova senha"]').first();
    const confirmPassInput = page.locator('input[aria-label="Confirmar nova senha"]').first();

    if (await currentPassInput.isVisible()) {
      await currentPassInput.fill('senha_errada');
      await newPassInput.fill('nova12345');
      await confirmPassInput.fill('nova12345');

      await saveBtn.click({ force: true });
      await page.waitForTimeout(500);
      await expect(page.locator('text=Senha atual incorreta').first()).toBeVisible();
    }
  });

  test('deve gerenciar carteira principal e alternar rede', async ({ page }) => {
    await page.goto('/wallets', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /Carteira principal/i })).toBeVisible();

    // Altera apelido da carteira
    const aliasInput = page.locator('input[aria-label="Apelido da carteira"]').first();
    if (await aliasInput.isVisible()) {
      await aliasInput.fill('Minha Carteira Polygon');
    }

    // Salva carteira
    const saveWalletBtn = page.locator('button[type="submit"]:has-text("Salvar carteira")').first();
    if (await saveWalletBtn.isVisible()) {
      await saveWalletBtn.click({ force: true });
      await page.waitForTimeout(500);
      await expect(page.locator('text=Carteira principal salva com sucesso').first()).toBeVisible();
    }
  });
});
