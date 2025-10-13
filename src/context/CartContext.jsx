import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Automatically clean up non-today dishes when loading
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const filtered = cart.filter(
      (item) => item.day?.toLowerCase() === today.toLowerCase()
    );

    if (filtered.length !== cart.length) {
      toast("Removed expired dishes from cart 🧹", { icon: "⚠️" });
      setCart(filtered);
      localStorage.setItem("cart", JSON.stringify(filtered));
    }
  }, []); // Run once on mount

  // ✅ Save to localStorage whenever cart updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add only today's dishes
  const addToCart = (dish) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    if (dish.day?.toLowerCase() !== today.toLowerCase()) {
      toast.error("You can only order today's dishes!");
      return;
    }

    setCart((prev) => {
      // Remove any old duplicate entry (prevents old quantity from lingering)
      const filtered = prev.filter((item) => item._id !== dish._id);

      // Add as new item with quantity = 1
      toast.success("Added to cart!");
      return [...filtered, { ...dish, quantity: 1 }];
    });
  };

  // ✅ Remove item (and instantly sync localStorage)
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

  // ✅ Checkout
  const checkout = () => {
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

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const invalid = cart.filter(
      (item) => item.day?.toLowerCase() !== today.toLowerCase()
    );

    if (invalid.length > 0) {
      toast.error("Remove dishes not available today before checkout!");
      return;
    }

    toast.success("Proceeding to checkout...");
    // Example: navigate("/checkout") or send order to backend
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
