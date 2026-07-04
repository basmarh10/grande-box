import { createContext, useContext, useMemo, useState } from "react";

// Panier en mémoire (React state) : se réinitialise au rafraîchissement de la page.
// Pour le rendre persistant, prévoir localStorage ou une vraie base (voir l'étape 7 du guide, Supabase).

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, size, qty }]

  const addItem = (product, qty = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...current, { id: product.id, name: product.name, price: product.price, size: product.size, qty }];
    });
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((i) => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems((current) => current.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur d'un <CartProvider>");
  return ctx;
}
