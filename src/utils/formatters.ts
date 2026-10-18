export function formatEthValue(value: string | number): string {
  const str = typeof value === 'number' ? value.toString() : value;
  const parts = str.split('.');
  if (parts.length === 1) {
    return `${parts[0]}.00 ETH`;
  }
  const decimals = (parts[1] || '').padEnd(2, '0');
  return `${parts[0]}.${decimals} ETH`;
}

export function formatShortAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUsdEstimate(ethStr: string, ethUsdRate = 3450): string {
  const num = parseFloat(ethStr);
  if (isNaN(num)) return '$0.00';
  const usd = num * ethUsdRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}
