import { describe, it, expect } from "vitest";
import { formatCompactNumber, formatCurrency, formatPercent, formatRelativeTime } from "./utils";

describe("formatCompactNumber", () => {
  it("formats small numbers as-is", () => {
    expect(formatCompactNumber(42)).toBe("42");
  });

  it("formats thousands with K suffix", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K");
  });

  it("formats millions with M suffix", () => {
    expect(formatCompactNumber(2500000)).toBe("2.5M");
  });

  it("formats zero", () => {
    expect(formatCompactNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    const result = formatCompactNumber(-1500);
    expect(result).toContain("1.5K");
  });
});

describe("formatCurrency", () => {
  it("formats USD with dollar sign", () => {
    const result = formatCurrency(1234);
    expect(result).toContain("$");
    expect(result).toContain("1,234");
  });

  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("$0");
  });

  it("formats compact when requested", () => {
    const result = formatCurrency(1500000, { compact: true });
    expect(result).toContain("$");
    expect(result).toContain("M");
  });
});

describe("formatPercent", () => {
  it("formats positive percentage", () => {
    expect(formatPercent(12.5)).toBe("12.5%");
  });

  it("formats negative percentage", () => {
    expect(formatPercent(-3.2)).toBe("-3.2%");
  });

  it("adds plus sign when signed option is true", () => {
    expect(formatPercent(5.1, { signed: true })).toBe("+5.1%");
  });

  it("does not add plus sign for negative values even with signed", () => {
    expect(formatPercent(-2.0, { signed: true })).toBe("-2.0%");
  });

  it("formats zero percent", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for very recent times", () => {
    const result = formatRelativeTime(new Date());
    expect(result).toBe("just now");
  });

  it("returns seconds ago", () => {
    const thirtySecAgo = new Date(Date.now() - 30 * 1000);
    const result = formatRelativeTime(thirtySecAgo);
    expect(result).toMatch(/^\d+s ago$/);
  });

  it("returns minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = formatRelativeTime(fiveMinAgo);
    expect(result).toMatch(/^\d+m ago$/);
  });

  it("returns hours ago", () => {
    const threeHrAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const result = formatRelativeTime(threeHrAgo);
    expect(result).toMatch(/^\d+h ago$/);
  });

  it("returns days ago", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(twoDaysAgo);
    expect(result).toMatch(/^\d+d ago$/);
  });

  it("handles string date input", () => {
    const result = formatRelativeTime(new Date().toISOString());
    expect(result).toBe("just now");
  });
});