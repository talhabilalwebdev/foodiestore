import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false); // ✅ Loading for checkout

  // ✅ Clean up expired dishes silently on mount
  useEffect(() => {
    const today = new Date().toLocaleDateString("ar-SA", { weekday: "long" });
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const filtered = savedCart.filter(
      (item) => item.day?.toLowerCase() === today.toLowerCase()
    );

    // Only overwrite cart if some items are expired
    if (filtered.length !== savedCart.length) {
      setCart(filtered);
      localStorage.setItem("cart", JSON.stringify(filtered));
      // ❌ No toast here to avoid confusing the user
    } else {
      setCart(savedCart);
    }
  }, []);

  // ✅ Save to localStorage whenever cart updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add only today's dishes
  const addToCart = (dish) => {
    const today = new Date().toLocaleDateString("en-SA", { weekday: "long" });

    if (dish.day?.toLowerCase() !== today.toLowerCase()) {
      toast.error(`You can only order today's dishes! ${today}`);
      return;
    }

    setCart((prev) => {
      const filtered = prev.filter((item) => item._id !== dish._id);
      toast.success("Added to cart!");
      return [...filtered, { ...dish, quantity: 1 }];
    });
  };

  // ✅ Remove item
  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updated)); // immediate sync
      return updated;
    });
    toast.success("Item removed!");
  };

  // ✅ Update quantity
  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
    toast.success("Quantity updated!");
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    toast.success("Cart cleared!");
  };

  // ✅ Checkout with loading
  const checkout = async () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken");

    if (!token) {
      toast.error("⚠️ You must log in to place an order!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const today = new Date().toLocaleDateString("ar-SA", { weekday: "long" });
    const invalid = cart.filter(
      (item) => item.day?.toLowerCase() !== today.toLowerCase()
    );

    if (invalid.length > 0) {
      toast.error("Remove dishes not available today before checkout!");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call or navigate to checkout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Proceeding to checkout...");
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        total,
        loading, // ✅ expose loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
