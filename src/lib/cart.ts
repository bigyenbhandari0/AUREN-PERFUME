import { useEffect, useState } from "react";
import { perfumes, type Size } from "./perfumes";

export type CartItem = { id: string; size: Size; qty: number };
const KEY = "yp-bag-v1";

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((s, i) => {
    const p = perfumes.find((x) => x.id === i.id);
    return s + (p ? p.prices[i.size] * i.qty : 0);
  }, 0);
}

export function addItem(items: CartItem[], id: string, size: Size): CartItem[] {
  const f = items.find((i) => i.id === id && i.size === size);
  if (f) return items.map((i) => (i === f ? { ...i, qty: i.qty + 1 } : i));
  return [...items, { id, size, qty: 1 }];
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal: cartSubtotal(items),
    add: (id: string, size: Size) => setItems((c) => addItem(c, id, size)),
    setQty: (id: string, size: Size, qty: number) =>
      setItems((c) =>
        qty <= 0
          ? c.filter((i) => !(i.id === id && i.size === size))
          : c.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i)),
      ),
    remove: (id: string, size: Size) => setItems((c) => c.filter((i) => !(i.id === id && i.size === size))),
  };
}
