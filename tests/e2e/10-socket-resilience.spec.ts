import { test, expect } from '@playwright/test';
import { resetDatabase, loginAs, setScenario, emitOrderUpdated } from './helpers/test-utils';

test.describe('Cenário 10: Resiliência de Socket (order.updated), Queda de Conexão e Reconciliação', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase(page);
    await loginAs(page, 'alexandre@kurio.art', 'kurio123');
  });

  test('deve reconciliar pedido pendente após recarga e atualizar para confirmado via order.updated', async ({
    page,
  }) => {
    // 1. Define modo de pagamento como 'pending' para simular transação em espera
    await setScenario(page, { paymentMode: 'pending' as any });

    // 2. Cria um pedido com status inicial pending
    const orderId = await page.evaluate(async () => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `idemp_${Date.now()}`,
          Authorization: `Bearer ${localStorage.getItem('__kurio_auth_token__')}`,
        },
        body: JSON.stringify({
          items: [{ nftId: 'nft_01', quantity: 1 }],
          walletAddress: '0x71C2B895C984c3B821A858712e96d9978EbC4982',
          network: 'Ethereum',
        }),
      });
      const order = await res.json();
      return order.id;
    });

    // 3. Navega para a página do pedido e verifica estado pendente
    await page.goto(`/orders/${orderId}`, { waitUntil: 'networkidle' });
    await expect(page.locator('text=Processando transação na blockchain').first()).toBeVisible();

    // 4. Simula recarga de página (F5 / reconexão)
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('text=Processando transação na blockchain').first()).toBeVisible();

    // 5. Dispara evento WebSocket order.updated com status confirmed
    await emitOrderUpdated(page, {
      orderId,
      status: 'confirmed',
    });
    await page.waitForTimeout(600);

    // 6. Verifica que a interface recebeu o evento e renderizou o recibo confirmado
    await expect(page.locator('text=Seus NFTs agora estão na sua carteira').first()).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('text=Ver no Etherscan').first()).toBeVisible();
  });
});
