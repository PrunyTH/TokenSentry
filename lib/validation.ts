const ETH_RE = /^0x[a-fA-F0-9]{40}$/;
const BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function isEthAddress(input: string): boolean {
  return ETH_RE.test(input.trim());
}

export function isSolMint(input: string): boolean {
  return BASE58_RE.test(input.trim());
}
