"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  /** Prix en FCFA, pour l'AFFICHAGE seulement : le serveur recalcule toujours le prix à la commande. */
  price: number;
  image?: string;
  quantity: number;
};

/** Les articles du panier regroupés par vendeur (une commande par vendeur). */
export type VendorGroup = {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
  count: number;
};

type CartContextType = {
  items: CartItem[];
  groups: VendorGroup[];
  /** false tant que le panier n'est pas lu depuis le navigateur (évite d'afficher « panier vide » à tort). */
  ready: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, vendorId: string) => void;
  updateQuantity: (productId: string, vendorId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const STORAGE_KEY = "annuairecafe-cart";
const MAX_QTY = 99;

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Le contenu du navigateur n'est jamais fiable (ancien format, valeur modifiée à la main…).
 * On ne garde que les lignes valides et on borne les nombres.
 */
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];

  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const r = x as Record<string, unknown>;
    if (
      typeof r.productId !== "string" ||
      typeof r.vendorId !== "string" ||
      typeof r.name !== "string"
    ) {
      continue;
    }

    const price = Number(r.price);
    const quantity = Math.floor(Number(r.quantity));

    out.push({
      productId: r.productId,
      vendorId: r.vendorId,
      vendorName: typeof r.vendorName === "string" ? r.vendorName : "",
      name: r.name,
      price: Number.isFinite(price) && price >= 0 ? Math.round(price) : 0,
      image: typeof r.image === "string" && r.image ? r.image : undefined,
      quantity:
        Number.isFinite(quantity) && quantity >= 1 ? Math.min(quantity, MAX_QTY) : 1,
    });
  }

  return out;
}

function parseStored(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    return sanitize(JSON.parse(value));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Lecture du panier au chargement + synchronisation entre onglets
  useEffect(() => {
    try {
      setItems(parseStored(localStorage.getItem(STORAGE_KEY)));
    } catch (error) {
      console.error("Erreur lecture du panier :", error);
    }
    setReady(true);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setItems(parseStored(e.newValue));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sauvegarde à chaque changement (une seule fois, ici)
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erreur sauvegarde du panier :", error);
    }
  }, [items, ready]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find(
        (x) => x.productId === item.productId && x.vendorId === item.vendorId
      );

      if (existing) {
        return current.map((x) =>
          x === existing
            ? { ...x, ...item, quantity: Math.min(x.quantity + 1, MAX_QTY) }
            : x
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, vendorId: string) => {
    setItems((current) =>
      current.filter((x) => !(x.productId === productId && x.vendorId === vendorId))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, vendorId: string, quantity: number) => {
      if (!Number.isFinite(quantity) || quantity <= 0) {
        removeFromCart(productId, vendorId);
        return;
      }
      const safe = Math.min(Math.floor(quantity), MAX_QTY);
      setItems((current) =>
        current.map((x) =>
          x.productId === productId && x.vendorId === vendorId
            ? { ...x, quantity: safe }
            : x
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const groups = useMemo<VendorGroup[]>(() => {
    const map = new Map<string, VendorGroup>();
    for (const item of items) {
      let group = map.get(item.vendorId);
      if (!group) {
        group = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          items: [],
          subtotal: 0,
          count: 0,
        };
        map.set(item.vendorId, group);
      }
      group.items.push(item);
      group.subtotal += item.price * item.quantity;
      group.count += item.quantity;
    }
    return Array.from(map.values());
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        groups,
        ready,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans CartProvider");
  }
  return context;
        }
