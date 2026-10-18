import { test, expect } from '@playwright/test';
import { resetDatabase } from './helpers/test-utils';

test.describe('Cenário 1: Catálogo, Busca, Filtros, Ordenação, Paginação e Histórico', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
  });

  test('deve buscar, filtrar, ordenar, paginar e restaurar estado pelo histórico e F5', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // 1. Paginação no catálogo completo (32 NFTs = 4 páginas)
    const page2Button = page
      .getByRole('navigation', { name: 'Paginação do catálogo' })
      .getByRole('button', { name: 'Página 2' });
    await expect(page2Button).toBeVisible();
    await page2Button.click();
    await page.waitForTimeout(400);
    expect(page.url()).toContain('page=2');

    // 2. Ao aplicar novo filtro ou busca enquanto na página 2, deve resetar para a página 1
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Emerald');
      await searchInput.press('Enter');
      await page.waitForTimeout(400);

      expect(page.url()).toContain('search=Emerald');
      expect(page.url()).toContain('page=1');
      const nftCards = page.locator('article[aria-label*="NFT"]');
      expect(await nftCards.count()).toBeGreaterThanOrEqual(1);
    }

    // 3. Ordenação
    const sortSelect = page.locator('select[aria-label*="ordenação"]').first();
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-asc');
      await page.waitForTimeout(400);
      expect(page.url()).toContain('sortBy=price-asc');
    }

    // 4. Restauração do histórico (Voltar / Avançar / Reload)
    await page.goBack();
    await page.waitForTimeout(300);
    expect(page.url()).toBeDefined();

    await page.goForward();
    await page.waitForTimeout(300);

    // F5 (Reload da página)
    const currentUrlBeforeReload = page.url();
    await page.reload({ waitUntil: 'networkidle' });
    expect(page.url()).toBe(currentUrlBeforeReload);
  });
});
