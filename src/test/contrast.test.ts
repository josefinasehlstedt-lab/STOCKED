import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function token(name: string) {
  const m = css.match(new RegExp(`--${name}:\\s*oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\)`));
  if (!m) throw new Error(`--${name} hittades inte som oklch`);
  return [Number(m[1]), Number(m[2]), Number(m[3])] as const;
}

function srgb(L: number, C: number, hDeg: number) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const [l, m, s] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(0, c) ** (1 / 2.4) - 0.055));
}

function luminance(rgb: number[]) {
  const lin = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (lin[0] ?? 0) + 0.7152 * (lin[1] ?? 0) + 0.0722 * (lin[2] ?? 0);
}

function ratio(c1: number[], c2: number[]) {
  const a = luminance(c1);
  const b = luminance(c2);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("kontrast i formulärkanter (WCAG 1.4.11)", () => {
  it("kantfärgen --input når minst 3:1 mot kortets bakgrund", () => {
    const input = srgb(...token("input"));
    const card = srgb(...token("card"));
    expect(ratio(input, card)).toBeGreaterThanOrEqual(3);
  });

  it("kantfärgen --input når minst 3:1 mot sidans bakgrund", () => {
    const input = srgb(...token("input"));
    const background = srgb(...token("background"));
    expect(ratio(input, background)).toBeGreaterThanOrEqual(3);
  });
});
