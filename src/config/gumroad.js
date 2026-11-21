// src/config/gumroad.js — Gumroad product configuration for DigitallyDefined.store
export const GUMROAD_STORE_URL = "https://digitallydefined.store";

export const GUMROAD_PRODUCTS = [
  { id: "digital-business-os", name: "Digital Business OS", url: "https://francescaonline.gumroad.com/l/digital-business-os", price: 49 },
];

export function gumroadLink(productId) {
  const p = GUMROAD_PRODUCTS.find((x) => x.id === productId);
  return p ? p.url : GUMROAD_STORE_URL;
}
