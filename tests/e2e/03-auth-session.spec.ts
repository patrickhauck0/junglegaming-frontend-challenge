import { test, expect } from '@playwright/test';
import { resetDatabase } from './helpers/test-utils';

test.describe('Cenário 3: Cadastro, Conflito 409, Login, Redirecionamento de Sessão e Logout', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve tratar conflito 409 no cadastro e cadastrar novo usuário com sucesso', async ({
    page,
  }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });

    // 1. Conflito 409 com e-mail existente
    await page.locator('input[placeholder="Nome de usuário"]').filter({ visible: true }).fill('alexandre_kurio');
    await page.locator('input[placeholder="Digite seu e-mail"]').filter({ visible: true }).fill('alexandre@kurio.art');
    await page.locator('input[placeholder="Senha"]').filter({ visible: true }).fill('kurio123');
    await page.locator('input[placeholder="Confirmar senha"]').filter({ visible: true }).fill('kurio123');
    await page.locator('form:has(input[placeholder="Nome de usuário"]) button[type="submit"]').filter({ visible: true }).click();

    await expect(page.locator('text=E-mail ou nome de usuário já cadastrado').filter({ visible: true })).toBeVisible({
      timeout: 5000,
    });

    // 2. Cadastro de usuário único com sucesso
    const uniqueId = Date.now().toString(36);
    await page.locator('input[placeholder="Nome de usuário"]').filter({ visible: true }).fill(`user_${uniqueId}`);
    await page.locator('input[placeholder="Digite seu e-mail"]').filter({ visible: true }).fill(`user_${uniqueId}@kurio.art`);
    await page.locator('input[placeholder="Senha"]').filter({ visible: true }).fill('kurio123');
    await page.locator('input[placeholder="Confirmar senha"]').filter({ visible: true }).fill('kurio123');
    await page.locator('form:has(input[placeholder="Nome de usuário"]) button[type="submit"]').filter({ visible: true }).click();

    // Deve redirecionar para a página inicial com sessão ativa
    await page.waitForURL('/', { timeout: 8000 });
    await expect(page.locator('a[aria-label*="perfil"], button[aria-label*="perfil"]').filter({ visible: true }).first()).toBeVisible();
  });

  test('deve redirecionar rota privada para login com retomada do fluxo e limpar dados no logout', async ({
    page,
  }) => {
    // 1. Tenta acessar rota privada sem autenticação
    await page.goto('/profile');
    await page.waitForURL((url) => url.pathname.includes('/login'), { timeout: 5000 });
    expect(page.url()).toContain('redirect=');

    // 2. Realiza login e verifica retomada automática para /profile
    await page.locator('input[placeholder*="email"], input[placeholder*="contato@"]').filter({ visible: true }).fill('alexandre@kurio.art');
    await page.locator('input[type="password"]').filter({ visible: true }).fill('kurio123');
    await page.locator('form:has(input[placeholder*="email"]) button[type="submit"]').filter({ visible: true }).click();

    await page.waitForURL((url) => url.pathname.includes('/profile'), { timeout: 8000 });
    await expect(page.locator('h1').filter({ visible: true }).first()).toContainText('Perfil do colecionador');

    // 3. Logout
    const logoutBtn = page.locator('button:has-text("Sair")').filter({ visible: true }).first();
    await logoutBtn.click({ force: true });
    await page.waitForTimeout(500);

    // Verifica que o botão Entrar está presente novamente
    await expect(page.locator('a:has-text("Entrar")').filter({ visible: true }).first()).toBeVisible();
  });
});
