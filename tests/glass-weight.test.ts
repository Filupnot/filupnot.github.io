import { describe, it, expect } from "vitest";
import {
  calculateImperialWeight,
  calculateMetricWeight,
  roundWeight,
  IMPERIAL_DENSITY,
  METRIC_DENSITY,
  CUBIC_INCHES_PER_CUBIC_FOOT,
  CUBIC_MM_PER_CUBIC_METER,
  IMPERIAL_THICKNESSES,
  METRIC_THICKNESSES
} from "../src/lib/glass-weight";

describe("glass weight calculations", () => {
  describe("calculateImperialWeight", () => {
    it("calculates weight for 48x36 at 1/4 inch (from mockup)", () => {
      // 48 × 36 × 0.25 × 158 / 1728 = 39.5 lbs
      const weight = calculateImperialWeight(48, 36, 0.25);
      expect(weight).toBeCloseTo(39.5, 1);
    });

    it("calculates weight for 48x36 at 3/8 inch (from mockup)", () => {
      // 48 × 36 × 0.375 × 158 / 1728 = 59.25 lbs
      const weight = calculateImperialWeight(48, 36, 0.375);
      expect(weight).toBeCloseTo(59.25, 1);
    });

    it("returns 0 when length is 0", () => {
      expect(calculateImperialWeight(0, 36, 0.25)).toBe(0);
    });

    it("returns 0 when width is 0", () => {
      expect(calculateImperialWeight(48, 0, 0.25)).toBe(0);
    });

    it("returns 0 when thickness is null", () => {
      expect(calculateImperialWeight(48, 36, null)).toBe(0);
    });

    it("returns 0 when thickness is 0", () => {
      expect(calculateImperialWeight(48, 36, 0)).toBe(0);
    });

    it("uses correct density constant", () => {
      expect(IMPERIAL_DENSITY).toBe(158);
    });

    it("uses correct cubic inches conversion", () => {
      expect(CUBIC_INCHES_PER_CUBIC_FOOT).toBe(1728); // 12^3
    });

    it("calculates weight for 1x1x1 inch cube", () => {
      // 1 × 1 × 1 × 158 / 1728 = 0.0914... lbs
      const weight = calculateImperialWeight(1, 1, 1);
      expect(weight).toBeCloseTo(158 / 1728, 4);
    });

    it("calculates weight for 12x12x12 inch cube (1 cubic foot)", () => {
      // 12 × 12 × 12 × 158 / 1728 = 158 lbs (exactly 1 cubic foot)
      const weight = calculateImperialWeight(12, 12, 12);
      expect(weight).toBeCloseTo(158, 0);
    });
  });

  describe("calculateMetricWeight", () => {
    it("calculates weight for 1000x1000x10mm sheet", () => {
      // 1000 × 1000 × 10 × 2531 / 1e9 = 25.31 kg
      const weight = calculateMetricWeight(1000, 1000, 10);
      expect(weight).toBeCloseTo(25.31, 1);
    });

    it("calculates weight for 1m x 1m x 1m cube (1 cubic meter)", () => {
      // 1000 × 1000 × 1000 × 2531 / 1e9 = 2531 kg
      const weight = calculateMetricWeight(1000, 1000, 1000);
      expect(weight).toBeCloseTo(2531, 0);
    });

    it("returns 0 when length is 0", () => {
      expect(calculateMetricWeight(0, 1000, 10)).toBe(0);
    });

    it("returns 0 when width is 0", () => {
      expect(calculateMetricWeight(1000, 0, 10)).toBe(0);
    });

    it("returns 0 when thickness is null", () => {
      expect(calculateMetricWeight(1000, 1000, null)).toBe(0);
    });

    it("returns 0 when thickness is 0", () => {
      expect(calculateMetricWeight(1000, 1000, 0)).toBe(0);
    });

    it("uses correct density constant", () => {
      expect(METRIC_DENSITY).toBe(2531);
    });

    it("uses correct cubic mm conversion", () => {
      expect(CUBIC_MM_PER_CUBIC_METER).toBe(1_000_000_000); // 1000^3
    });

    it("calculates weight for standard 6mm glass at 1219x914 (48x36 inches equivalent)", () => {
      // Approximately 48" x 36" in mm is 1219.2 x 914.4
      // Weight should be similar to imperial calculation
      const weight = calculateMetricWeight(1219.2, 914.4, 6.35); // 1/4" = 6.35mm
      // Expected: around 17.9 kg (39.5 lbs ÷ 2.205)
      expect(weight).toBeCloseTo(17.9, 0);
    });
  });

  describe("roundWeight", () => {
    it("returns 0 for 0", () => {
      expect(roundWeight(0)).toBe(0);
    });

    it("rounds values >= 1 to whole numbers", () => {
      expect(roundWeight(39.5)).toBe(40);
      expect(roundWeight(59.25)).toBe(59);
      expect(roundWeight(100.49)).toBe(100);
      expect(roundWeight(100.5)).toBe(101);
    });

    it("rounds values < 1 to one decimal place", () => {
      expect(roundWeight(0.5)).toBe(0.5);
      expect(roundWeight(0.123)).toBe(0.1);
      expect(roundWeight(0.156)).toBe(0.2);
      expect(roundWeight(0.999)).toBe(1);
    });
  });

  describe("thickness options", () => {
    it("has imperial thicknesses defined", () => {
      expect(IMPERIAL_THICKNESSES.length).toBeGreaterThan(0);
      expect(IMPERIAL_THICKNESSES[0]).toHaveProperty("label");
      expect(IMPERIAL_THICKNESSES[0]).toHaveProperty("value");
    });

    it("has metric thicknesses defined", () => {
      expect(METRIC_THICKNESSES.length).toBeGreaterThan(0);
      expect(METRIC_THICKNESSES[0]).toHaveProperty("label");
      expect(METRIC_THICKNESSES[0]).toHaveProperty("value");
    });

    it("imperial thicknesses include common sizes", () => {
      const values = IMPERIAL_THICKNESSES.map((t) => t.value);
      expect(values).toContain(0.125); // 1/8"
      expect(values).toContain(0.25); // 1/4"
      expect(values).toContain(0.375); // 3/8"
      expect(values).toContain(0.5); // 1/2"
    });

    it("metric thicknesses include common sizes", () => {
      const values = METRIC_THICKNESSES.map((t) => t.value);
      expect(values).toContain(3);
      expect(values).toContain(6);
      expect(values).toContain(10);
      expect(values).toContain(12);
    });
  });
});
