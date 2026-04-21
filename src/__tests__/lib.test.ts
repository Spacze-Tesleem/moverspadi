/**
 * Unit tests for src/lib/cn.ts and src/lib/format.ts.
 *
 * cn() — verifies clsx conditional merging and tailwind-merge deduplication.
 * format — verifies formatNaira, formatDate, and truncate output.
 */

import { describe, it, expect } from "vitest";
import { cn } from "../lib/cn";
import { formatNaira, formatDate, truncate } from "../lib/format";

// ── cn() ─────────────────────────────────────────────────────────────────────

describe("cn()", () => {
  it("joins plain class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("handles conditional objects via clsx", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500"
    );
  });

  it("deduplicates conflicting Tailwind utilities via tailwind-merge", () => {
    // tailwind-merge keeps the last conflicting class
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("deduplicates padding conflicts", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("returns empty string when no classes are provided", () => {
    expect(cn()).toBe("");
  });

  it("preserves non-conflicting classes alongside merged ones", () => {
    const result = cn("flex", "bg-red-500", "bg-blue-500", "rounded");
    expect(result).toContain("flex");
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("rounded");
    expect(result).not.toContain("bg-red-500");
  });
});

// ── formatNaira() ─────────────────────────────────────────────────────────────

describe("formatNaira()", () => {
  it("formats zero", () => {
    expect(formatNaira(0)).toMatch(/₦|NGN/);
  });

  it("formats a whole number without decimal places", () => {
    const result = formatNaira(5000);
    expect(result).toMatch(/5[,.]?000/);
    expect(result).not.toMatch(/\.\d{2}/); // no cents
  });

  it("formats a large amount with thousands separator", () => {
    const result = formatNaira(45000);
    // Should contain 45 and 000 separated by a grouping character
    expect(result).toMatch(/45[,.]?000/);
  });

  it("includes the NGN currency symbol or code", () => {
    const result = formatNaira(3500);
    expect(result).toMatch(/₦|NGN/);
  });
});

// ── formatDate() ──────────────────────────────────────────────────────────────

describe("formatDate()", () => {
  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("formats a valid ISO date string", () => {
    const result = formatDate("2024-01-15");
    // Should contain the year and some form of the month/day
    expect(result).toContain("2024");
    expect(result).toMatch(/Jan/i);
  });

  it("includes a weekday abbreviation", () => {
    // 2024-01-15 is a Monday
    const result = formatDate("2024-01-15");
    expect(result).toMatch(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/i);
  });
});

// ── truncate() ────────────────────────────────────────────────────────────────

describe("truncate()", () => {
  it("returns the string unchanged when within the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the string unchanged when exactly at the limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates and appends ellipsis when over the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("truncates to the correct length", () => {
    const result = truncate("abcdefghij", 4);
    expect(result).toBe("abcd…");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });
});
