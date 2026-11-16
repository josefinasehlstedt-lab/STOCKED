export type Recipe = { id: string; title: string; category: string; time: string; ingredients: string[]; steps: string[] };
export const categories = ["Alla", "Vardag", "Vegetariskt", "Fisk", "Frukost"];
export const recipes: Recipe[] = [
  { id: "pasta-tomat", title: "Pasta med tomat och vitlök", category: "Vegetariskt", time: "20 min",
    ingredients: ["Pasta", "Krossade tomater", "Vitlök", "Olivolja", "Basilika"],
    steps: ["Koka pastan enligt förpackningen.", "Fräs hackad vitlök i olivolja.", "Tillsätt krossade tomater och låt puttra 10 min.", "Blanda med pastan och toppa med basilika."] },
  { id: "lax-spenat", title: "Ugnsbakad lax med spenat", category: "Fisk", time: "30 min",
    ingredients: ["Laxfilé", "Spenat", "Smör", "Citron", "Vitlök"],
    steps: ["Sätt ugnen på 200 °C.", "Lägg laxen i en form med smör och citron.", "Baka i 15–18 minuter.", "Fräs spenat och vitlök i smör och servera till."] },
  { id: "omelett", title: "Spenatomelett", category: "Frukost", time: "10 min",
    ingredients: ["Ägg", "Spenat", "Smör", "Mjölk", "Ost"],
    steps: ["Vispa ägg och mjölk.", "Smält smör i en panna.", "Häll i äggen och strö över spenat och ost.", "Vik ihop och servera."] },
  { id: "artsoppa", title: "Krämig ärtsoppa", category: "Vardag", time: "25 min",
    ingredients: ["Ärtor", "Gul lök", "Buljong", "Mjölk", "Smör"],
    steps: ["Fräs löken i smör.", "Tillsätt ärtor och buljong, koka 10 min.", "Mixa slätt med mjölken.", "Smaka av med salt och peppar."] },
];
export const hasAt = (ing: string, names: string[]) => names.some((n) => n.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(n.toLowerCase()));
