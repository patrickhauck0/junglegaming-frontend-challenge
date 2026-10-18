import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('Visual Audit - Home and NFT Details', () => {
  test('capture full page screenshots for Desktop and Mobile', async ({ page }, testInfo) => {
    const outputDir = path.resolve(process.cwd(), 'playwright-screenshots');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (testInfo.project.name === 'Desktop Chromium') {
      await page.setViewportSize({ width: 1440, height: 900 });

      // 1. Home Desktop
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-home.png'),
        fullPage: true,
      });

      // 2. Detalhes Desktop
      await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-nft-details.png'),
        fullPage: true,
      });

      // 3. Carrinho Desktop
      await page.goto('/cart', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-cart.png'),
        fullPage: true,
      });

      // 4. Pagamento Desktop
      await page.goto('/payment', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-payment.png'),
        fullPage: true,
      });

      // 5. Confirmação de Pedido Desktop
      await page.goto('/orders/order_demo', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-order-confirmation.png'),
        fullPage: true,
      });

      // 6. Login Desktop
      await page.goto('/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-login.png'),
        fullPage: true,
      });

      // 7. Cadastro Desktop
      await page.goto('/register', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-register.png'),
        fullPage: true,
      });

      // 8. Perfil do Colecionador Desktop
      await page.goto('/profile', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-profile.png'),
        fullPage: true,
      });

      // 9. Carteiras Desktop
      await page.goto('/wallets', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-wallets.png'),
        fullPage: true,
      });
    }

    if (testInfo.project.name === 'Mobile Chromium') {
      await page.setViewportSize({ width: 390, height: 844 });

      // 1. Home Mobile
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-home.png'),
        fullPage: true,
      });

      // 2. Detalhes Mobile
      await page.goto('/nfts/nft_01', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-nft-details.png'),
        fullPage: true,
      });

      // 3. Carrinho Mobile
      await page.goto('/cart', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-cart.png'),
        fullPage: true,
      });

      // 4. Pagamento Mobile
      await page.goto('/payment', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-payment.png'),
        fullPage: true,
      });

      // 5. Confirmação de Pedido Mobile
      await page.goto('/orders/order_demo', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-order-confirmation.png'),
        fullPage: true,
      });

      // 6. Login Mobile
      await page.goto('/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-login.png'),
        fullPage: true,
      });

      // 7. Cadastro Mobile
      await page.goto('/register', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-register.png'),
        fullPage: true,
      });

      // 8. Perfil do Colecionador Mobile
      await page.goto('/profile', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-profile.png'),
        fullPage: true,
      });

      // 9. Carteiras Mobile
      await page.goto('/wallets', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-wallets.png'),
        fullPage: true,
      });
    }
  });
});
