import { http, HttpResponse, delay } from 'msw';
import { getDb } from '../db';
import { getScenarioConfig } from '../scenarios';
import { addEth, subtractEth, multiplyEthByQuantity, applyDiscountPercent } from '@/utils/eth-math';

const NETWORK_GAS_FEES: Record<string, string> = {
  Ethereum: '0.005',
  Polygon: '0.001',
  Solana: '0.0005',
};

export const quoteHandlers = [
  http.post('/api/quote', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const body = (await request.json()) as {
      items?: Array<{ nftId: string; quantity: number }>;
      couponCode?: string;
      network?: string;
    };

    const { items = [], couponCode, network = 'Ethereum' } = body;
    const db = getDb();

    let subtotalEth = '0.00';
    let isStale = false;

    for (const item of items) {
      const nft = db.nfts.find((n) => n.id === item.nftId);
      if (nft) {
        const itemTotal = multiplyEthByQuantity(nft.priceEth, item.quantity);
        subtotalEth = addEth(subtotalEth, itemTotal);
      } else {
        isStale = true;
      }
    }

    let discountEth = '0.00';
    let discountPercent = 0;
    let isCouponApplied = false;
    let couponMessage: string | undefined;

    if (couponCode) {
      const upperCode = couponCode.trim().toUpperCase();
      const coupon = db.coupons.find((c) => c.code.toUpperCase() === upperCode);

      if (!coupon) {
        couponMessage = 'Cupom inexistente ou inválido';
      } else if (coupon.isExpired) {
        couponMessage = 'Este cupom já expirou';
      } else {
        discountPercent = coupon.discountPercent;
        const discountResult = applyDiscountPercent(subtotalEth, discountPercent);
        discountEth = discountResult.discountEth;
        isCouponApplied = true;
        couponMessage = `${coupon.discountPercent}% de desconto aplicado!`;
      }
    }

    const gasFeeEth = NETWORK_GAS_FEES[network] || '0.005';
    const subtotalAfterDiscount = subtractEth(subtotalEth, discountEth);
    const totalEth = addEth(subtotalAfterDiscount, gasFeeEth);

    return HttpResponse.json({
      subtotalEth,
      discountEth,
      gasFeeEth,
      totalEth,
      couponCode: isCouponApplied ? couponCode : undefined,
      discountPercent: isCouponApplied ? discountPercent : undefined,
      isCouponApplied,
      couponMessage,
      isStale,
      calculatedAt: new Date().toISOString(),
    });
  }),
];
