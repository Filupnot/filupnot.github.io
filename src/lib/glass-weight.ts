/**
 * Glass weight calculation utilities
 *
 * Formula: Weight = Length × Width × Thickness × Density / UnitConversion
 *
 * Imperial: 158 lb/ft³ density, dimensions in inches
 *   - 1 ft³ = 12³ = 1728 in³
 *   - Weight (lbs) = L(in) × W(in) × T(in) × 158 / 1728
 *
 * Metric: 2531 kg/m³ density, dimensions in mm
 *   - 1 m³ = 1000³ = 1,000,000,000 mm³
 *   - Weight (kg) = L(mm) × W(mm) × T(mm) × 2531 / 1,000,000,000
 */

export const IMPERIAL_DENSITY = 158; // lb/ft³
export const METRIC_DENSITY = 2531; // kg/m³
export const CUBIC_INCHES_PER_CUBIC_FOOT = 1728; // 12³
export const CUBIC_MM_PER_CUBIC_METER = 1_000_000_000; // 1000³

export type ThicknessOption = {
  label: string;
  value: number;
};

export const IMPERIAL_THICKNESSES: ThicknessOption[] = [
  { label: '1/8"', value: 0.125 },
  { label: '3/16"', value: 0.1875 },
  { label: '1/4"', value: 0.25 },
  { label: '5/16"', value: 0.3125 },
  { label: '3/8"', value: 0.375 },
  { label: '1/2"', value: 0.5 },
  { label: '5/8"', value: 0.625 },
  { label: '3/4"', value: 0.75 },
  { label: '1"', value: 1.0 }
];

export const METRIC_THICKNESSES: ThicknessOption[] = [
  { label: "3mm", value: 3 },
  { label: "4mm", value: 4 },
  { label: "5mm", value: 5 },
  { label: "6mm", value: 6 },
  { label: "8mm", value: 8 },
  { label: "10mm", value: 10 },
  { label: "12mm", value: 12 },
  { label: "15mm", value: 15 },
  { label: "19mm", value: 19 },
  { label: "25mm", value: 25 }
];

/**
 * Calculate glass weight in pounds (Imperial)
 * @param lengthInches - Length in inches
 * @param widthInches - Width in inches
 * @param thicknessInches - Thickness in inches (or null if not selected)
 * @returns Weight in pounds
 */
export function calculateImperialWeight(
  lengthInches: number,
  widthInches: number,
  thicknessInches: number | null
): number {
  if (
    thicknessInches === null ||
    !lengthInches ||
    !widthInches ||
    !thicknessInches
  ) {
    return 0;
  }
  const volumeCubicInches = lengthInches * widthInches * thicknessInches;
  return (volumeCubicInches * IMPERIAL_DENSITY) / CUBIC_INCHES_PER_CUBIC_FOOT;
}

/**
 * Calculate glass weight in kilograms (Metric)
 * @param lengthMm - Length in millimeters
 * @param widthMm - Width in millimeters
 * @param thicknessMm - Thickness in millimeters (or null if not selected)
 * @returns Weight in kilograms
 */
export function calculateMetricWeight(
  lengthMm: number,
  widthMm: number,
  thicknessMm: number | null
): number {
  if (thicknessMm === null || !lengthMm || !widthMm || !thicknessMm) {
    return 0;
  }
  const volumeCubicMm = lengthMm * widthMm * thicknessMm;
  return (volumeCubicMm * METRIC_DENSITY) / CUBIC_MM_PER_CUBIC_METER;
}

/**
 * Round weight to a reasonable display precision
 * @param weight - Raw calculated weight
 * @returns Rounded weight (whole number for values >= 1, one decimal for smaller)
 */
export function roundWeight(weight: number): number {
  if (weight === 0) return 0;
  if (weight >= 1) return Math.round(weight);
  return Math.round(weight * 10) / 10;
}
