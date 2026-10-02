import { describe, it, expect } from "vitest";
import { HIKE_OPTIONS, sameName, weekendOptions } from "../src/lib/hike-poll";

describe("hike poll", () => {
  it("lists the remaining October 2026 weekend days plus 11/1", () => {
    expect(HIKE_OPTIONS.map((option) => option.label)).toEqual([
      "Sat 10/3",
      "Sun 10/4",
      "Sat 10/10",
      "Sun 10/11",
      "Sat 10/17",
      "Sun 10/18",
      "Sat 10/24",
      "Sun 10/25",
      "Sat 10/31",
      "Sun 11/1"
    ]);
    expect(HIKE_OPTIONS[0].date).toBe("2026-10-03");
  });

  it("includes the whole month by default", () => {
    expect(weekendOptions(2026, 10)).toHaveLength(9);
  });

  it("matches names case-insensitively", () => {
    expect(sameName(" Phil ", "phil")).toBe(true);
    expect(sameName("Phil", "Philip")).toBe(false);
  });
});
