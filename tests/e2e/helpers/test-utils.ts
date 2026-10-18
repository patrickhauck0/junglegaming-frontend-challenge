import type { Page } from '@playwright/test';
import type { ScenarioConfig } from '@/mocks/scenarios';

/**
 * Reseta o banco de dados do MSW, storage local/sessão e configurações de cenário
 * para garantir isolamento determinístico absoluto entre os testes.
 */
export async function resetDatabase(page: Page) {
  // Navega para a base caso ainda não esteja em nenhuma página
  if (page.url() === 'about:blank') {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      await fetch('/api/__test__/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // Ignora erro de rede em transição
    }
  });

  // Aguarda estabilização do ciclo de eventos
  await page.waitForTimeout(100);
}

/**
 * Atualiza o cenário de simulação do MSW (latência, erros, pagamentos).
 */
export async function setScenario(page: Page, config: Partial<ScenarioConfig>) {
  await page.evaluate(async (cfg) => {
    await fetch('/api/__test__/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    });
  }, config);
}

/**
 * Dispara evento WebSocket nft.updated via handler de teste do MSW.
 */
export async function emitNftUpdated(
  page: Page,
  payload: { nftId: string; priceEth?: string; availableEditions?: number }
) {
  await page.evaluate(async (data) => {
    const res = await fetch('/api/__test__/emit-nft-updated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    const socket = (window as any).__KURIO_SOCKET_CLIENT__?.getSocket();
    if (socket && json?.event) {
      socket.listeners('nft.updated')?.forEach((fn: any) => fn(json.event));
    }
  }, payload);
}

/**
 * Dispara evento WebSocket order.updated via handler de teste do MSW.
 */
export async function emitOrderUpdated(
  page: Page,
  payload: { orderId: string; status: 'confirmed' | 'declined'; userId?: string }
) {
  await page.evaluate(async (data) => {
    const res = await fetch('/api/__test__/emit-order-updated', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    const socket = (window as any).__KURIO_SOCKET_CLIENT__?.getSocket();
    if (socket && json?.event) {
      socket.listeners('order.updated')?.forEach((fn: any) => fn(json.event));
    }
  }, payload);
}

/**
 * Realiza login pela interface real preenchendo o formulário de login.
 */
export async function loginAs(
  page: Page,
  emailOrUsername = 'contato@email.com',
  password = 'kurio123'
) {
  await page.goto('/login');
  const inputEmail = page
    .locator('input[placeholder*="email"], input[placeholder*="contato@"]')
    .filter({ visible: true })
    .first();
  const inputPass = page
    .locator('input[type="password"]')
    .filter({ visible: true })
    .first();

  await inputEmail.fill(emailOrUsername);
  await inputPass.fill(password);
  await page
    .locator('form:has(input[type="password"]) button[type="submit"]')
    .filter({ visible: true })
    .first()
    .click();

  // Aguarda redirecionamento para fora da página de login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 8000 });
}

/**
 * Desabilita animações e transições CSS para capturas de tela perfeitamente determinísticas.
 */
export async function freezeAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
    `,
  });
}
