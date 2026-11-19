import { useSyncExternalStore } from "react";

export type Place = "kyl" | "frys" | "skafferi";
export type Item = { id: string; name: string; brand?: string | undefined; place: Place; qty: number; expires: string; barcode?: string | undefined };
export type ShopItem = { id: string; name: string };
export type State = { onboarded: boolean; items: Item[]; shop: ShopItem[] };

const KEY = "stocked-v1";
const today = (d: number) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
const seed: State = {
  onboarded: false,
  items: [
    { id: "1", name: "Mjölk", brand: "Arla", place: "kyl", qty: 1, expires: today(1) },
    { id: "2", name: "Ägg", place: "kyl", qty: 6, expires: today(6) },
    { id: "3", name: "Smör", place: "kyl", qty: 1, expires: today(20) },
    { id: "4", name: "Spenat", place: "kyl", qty: 1, expires: today(2) },
    { id: "5", name: "Laxfilé", place: "frys", qty: 2, expires: today(60) },
    { id: "6", name: "Ärtor", place: "frys", qty: 1, expires: today(120) },
    { id: "7", name: "Pasta", place: "skafferi", qty: 2, expires: today(300) },
    { id: "8", name: "Krossade tomater", place: "skafferi", qty: 3, expires: today(200) },
    { id: "9", name: "Vitlök", place: "skafferi", qty: 1, expires: today(14) },
  ],
  shop: [
    { id: "s1", name: "Bröd" },
    { id: "s2", name: "Kaffe" },
  ],
};

let state: State = seed;
let loaded = false;
const subs = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const raw = localStorage.getItem(KEY); if (raw) state = { ...seed, ...JSON.parse(raw) }; } catch {}
}
export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}
export function useStore() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => { load(); return state; },
    () => seed,
  );
}
export const uid = () => Math.random().toString(36).slice(2, 10);

export function daysLeft(expires: string) {
  const d = new Date(expires + "T00:00:00").getTime();
  const t = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00").getTime();
  return Math.round((d - t) / 864e5);
}
export function expiryLabel(n: number) {
  if (n < 0) return "Har gått ut";
  if (n === 0) return "Går ut idag";
  if (n === 1) return "Går ut imorgon";
  return `${n} dagar kvar`;
}
export const placeLabel: Record<Place, string> = { kyl: "Kyl", frys: "Frys", skafferi: "Skafferi" };
