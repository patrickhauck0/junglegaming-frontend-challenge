const WEI_PER_ETH = 10n ** 18n;

export function parseEthToWei(ethStr: string): bigint {
  const sanitized = ethStr.trim().replace(',', '.');
  if (!sanitized || sanitized === '.') {
    return 0n;
  }

  const [integerPart = '0', fractionPart = ''] = sanitized.split('.');
  const cleanInt = integerPart.replace(/^0+(?=\d)/, '') || '0';
  const paddedFraction = (fractionPart + '0'.repeat(18)).slice(0, 18);

  const intWei = BigInt(cleanInt) * WEI_PER_ETH;
  const fracWei = BigInt(paddedFraction);

  return intWei + fracWei;
}

export function formatWeiToEth(wei: bigint, minDecimals = 2, maxDecimals = 6): string {
  if (wei < 0n) {
    return '0.00';
  }

  const integerPart = wei / WEI_PER_ETH;
  const remainder = wei % WEI_PER_ETH;

  if (remainder === 0n && minDecimals === 0) {
    return integerPart.toString();
  }

  const remainderStr = remainder.toString().padStart(18, '0');
  let truncated = remainderStr.slice(0, maxDecimals);

  // Remove trailing zeros beyond minDecimals
  while (truncated.length > minDecimals && truncated.endsWith('0')) {
    truncated = truncated.slice(0, -1);
  }

  if (truncated.length < minDecimals) {
    truncated = truncated.padEnd(minDecimals, '0');
  }

  return `${integerPart.toString()}.${truncated}`;
}

export function addEth(a: string, b: string): string {
  const weiA = parseEthToWei(a);
  const weiB = parseEthToWei(b);
  return formatWeiToEth(weiA + weiB);
}

export function subtractEth(a: string, b: string): string {
  const weiA = parseEthToWei(a);
  const weiB = parseEthToWei(b);
  const diff = weiA > weiB ? weiA - weiB : 0n;
  return formatWeiToEth(diff);
}

export function multiplyEthByQuantity(ethStr: string, quantity: number): string {
  const validQty = BigInt(Math.max(0, Math.floor(quantity)));
  const wei = parseEthToWei(ethStr);
  return formatWeiToEth(wei * validQty);
}

export function applyDiscountPercent(ethStr: string, percent: number): { discountEth: string; finalEth: string } {
  const totalWei = parseEthToWei(ethStr);
  const validPercent = BigInt(Math.max(0, Math.min(100, Math.floor(percent))));
  const discountWei = (totalWei * validPercent) / 100n;
  const finalWei = totalWei >= discountWei ? totalWei - discountWei : 0n;

  return {
    discountEth: formatWeiToEth(discountWei),
    finalEth: formatWeiToEth(finalWei),
  };
}

export function compareEth(a: string, b: string): -1 | 0 | 1 {
  const weiA = parseEthToWei(a);
  const weiB = parseEthToWei(b);
  if (weiA < weiB) return -1;
  if (weiA > weiB) return 1;
  return 0;
}
