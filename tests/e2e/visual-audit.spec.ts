import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('Visual Audit - Home Page', () => {
  test('capture full page screenshots for Desktop and Mobile', async ({ page }, testInfo) => {
    const outputDir = path.resolve(process.cwd(), 'playwright-screenshots');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (testInfo.project.name === 'Desktop Chromium') {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/', { waitUntil: 'networkidle' });
      // Aguardar renderização das imagens
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(outputDir, 'desktop-home.png'),
        fullPage: true,
      });
    }

    if (testInfo.project.name === 'Mobile Chromium') {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: path.join(outputDir, 'mobile-home.png'),
        fullPage: true,
      });
    }
  });
});
