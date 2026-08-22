/**
 * Proof-of-concept only: hard-coded QC photo URLs for a single product.
 * Not a general catalog field — do not use for bulk imports yet.
 */
const QC_IMAGES_POC: Record<string, string[]> = {
  "189": [
    "/qc-poc/189/qc-1.jpg",
    "/qc-poc/189/qc-2.jpg",
    "/qc-poc/189/qc-3.jpg",
  ],
};

export function getQcImagesPoc(productId: string): string[] {
  return QC_IMAGES_POC[productId] ?? [];
}
