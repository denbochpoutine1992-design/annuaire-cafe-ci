"use client";

import {
  createContext,
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
  price: number;
  image?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, vendorId: string) => void;
  updateQuantity: (
    productId: string,
    vendorId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "annuairecafe-cart"
      );

      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erreur panier :", error);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
  if (!loaded) return;

  try {
    localStorage.setItem(
      "annuairecafe-cart",
      JSON.stringify(items)
    );
  } catch (error) {
    console.error("Erreur sauvegarde panier :", error);
  }
}, [items, loaded]);

  function addToCart(
  item: Omit<CartItem, "quantity">
) {
  setItems((current) => {
    const existing = current.find(
      (x) =>
        x.productId === item.productId &&
        x.vendorId === item.vendorId
    );

    let nextItems: CartItem[];

    if (existing) {
      nextItems = current.map((x) =>
        x.productId === item.productId &&
        x.vendorId === item.vendorId
          ? {
              ...x,
              ...item,
              quantity: x.quantity + 1,
            }
          : x
      );
    } else {
      nextItems = [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    }

    try {
      localStorage.setItem(
        "annuairecafe-cart",
        JSON.stringify(nextItems)
      );
    } catch (error) {
      console.error("Erreur sauvegarde panier :", error);
    }

    return nextItems;
  });
}

  function removeFromCart(
    productId: string,
    vendorId: string
  ) {
    setItems((current) =>
      current.filter(
        (x) =>
          !(
            x.productId === productId &&
            x.vendorId === vendorId
          )
      )
    );
  }

  function updateQuantity(
    productId: string,
    vendorId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeFromCart(productId, vendorId);
      return;
    }

    setItems((current) =>
      current.map((x) =>
        x.productId === productId &&
        x.vendorId === vendorId
          ? {
              ...x,
              quantity,
            }
          : x
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),
    [items]
  );

  const count = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
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
    throw new Error(
      "useCart doit être utilisé dans CartProvider"
    );
  }

  return context;
}
