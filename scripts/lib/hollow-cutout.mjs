/**
 * Detects processed cutouts where a white garment was eaten by background
 * removal — only logos/accents remain on a white matte field.
 */
export function isHollowWhiteGarmentCutout(data, width, height) {
  const innerL = Math.floor(width * 0.12);
  const innerR = Math.ceil(width * 0.88);
  const innerT = Math.floor(height * 0.12);
  const innerB = Math.ceil(height * 0.88);

  let innerTotal = 0;
  let nearWhite = 0;
  let dark = 0;
  let accent = 0;
  let mid = 0;

  for (let y = innerT; y < innerB; y++) {
    for (let x = innerL; x < innerR; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      innerTotal++;

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);

      if (lum >= 235) nearWhite++;
      else if (lum < 70) dark++;
      else if (chroma > 28) accent++;
      else mid++;
    }
  }

  if (innerTotal < 100) return false;

  const nearWhiteRatio = nearWhite / innerTotal;
  const darkRatio = dark / innerTotal;
  const accentRatio = accent / innerTotal;
  const midRatio = mid / innerTotal;

  return (
    nearWhiteRatio > 0.86 &&
    accentRatio < 0.08 &&
    darkRatio < 0.05 &&
    midRatio < 0.12
  );
}
