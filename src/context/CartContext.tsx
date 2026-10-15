"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export interface CartItem {
  cartItemId: string; // unique key e.g. "product-id-size-frame"
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  frame: string;
  quantity: number;
}

export interface AppliedCoupon {
  id: string;
  code: string;
  name: string;
  discount_amount: number;
  discount_percentage: number;
  applies_to: "order" | "product";
  eligible_amount: number;
  subtotal: number;
  final_amount: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  finalTotal: number;
  discountAmount: number;
  appliedCoupon: AppliedCoupon | null;
  couponError: string | null;
  couponSuccess: string | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "cartItemId" | "quantity"> & { quantity?: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "god_store_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.coupon) setAppliedCoupon(parsed.coupon);
      }
    } catch (e) {
      console.warn("Could not load cart from storage", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, coupon: appliedCoupon })
      );
    } catch (e) {
      console.warn("Could not save cart to storage", e);
    }
  }, [items, appliedCoupon, loaded]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.min(appliedCoupon.discount_amount, subtotal);
  }, [appliedCoupon, subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Backend authoritative coupon validation
  const validateCouponWithBackend = useCallback(
    async (code: string, currentItems: CartItem[]): Promise<AppliedCoupon | null> => {
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, items: currentItems }),
        });
        const json = await res.json();
        if (json.valid && json.coupon) {
          return json.coupon as AppliedCoupon;
        } else {
          setCouponError(json.message || "Invalid coupon");
          return null;
        }
      } catch (err) {
        setCouponError("Could not validate coupon. Please check connection.");
        return null;
      }
    },
    []
  );

  // Revalidate coupon whenever cart items change
  useEffect(() => {
    if (!appliedCoupon || items.length === 0) {
      if (items.length === 0 && appliedCoupon) {
        setAppliedCoupon(null);
      }
      return;
    }

    let active = true;
    (async () => {
      const revalidated = await validateCouponWithBackend(appliedCoupon.code, items);
      if (!active) return;
      if (revalidated) {
        setAppliedCoupon(revalidated);
      } else {
        setAppliedCoupon(null);
        setCouponError(`Coupon '${appliedCoupon.code}' was removed because cart requirements changed.`);
      }
    })();

    return () => {
      active = false;
    };
  }, [items, appliedCoupon?.code, validateCouponWithBackend]);

  const addItem = useCallback(
    (item: Omit<CartItem, "cartItemId" | "quantity"> & { quantity?: number }) => {
      const quantity = Math.max(1, item.quantity || 1);
      const cartItemId = `${item.id}-${item.size || "standard"}-${item.frame || "unframed"}`;

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          return [...prev, { ...item, cartItemId, quantity }];
        }
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  }, []);

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      setCouponError(null);
      setCouponSuccess(null);
      if (!code.trim()) {
        setCouponError("Please enter a coupon code");
        return false;
      }
      if (items.length === 0) {
        setCouponError("Your cart is empty");
        return false;
      }

      const validCoupon = await validateCouponWithBackend(code.trim(), items);
      if (validCoupon) {
        setAppliedCoupon(validCoupon);
        setCouponSuccess(`✓ Coupon '${validCoupon.code}' applied! Saved ₹${validCoupon.discount_amount.toLocaleString("en-IN")}.`);
        return true;
      }
      return false;
    },
    [items, validateCouponWithBackend]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  }, []);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      finalTotal,
      discountAmount,
      appliedCoupon,
      couponError,
      couponSuccess,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [
      items,
      totalItems,
      subtotal,
      finalTotal,
      discountAmount,
      appliedCoupon,
      couponError,
      couponSuccess,
      isCartOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
