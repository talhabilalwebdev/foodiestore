import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
    const { cart } = useContext(CartContext);

    return (
        <div className="min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
            <div className="w-full lg:w-2/3 space-y-5">
                <h2 className="text-4xl font-semibold mb-8">Your Cart</h2>

                {cart.items && cart.items.length > 0 ? (
                    <div className="space-y-6">
                        {cart.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b pb-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`https://foodiebackend-1-ef18.onrender.com${item.img}`}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">
                                            ${item.price} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xl font-bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}

                        {/* Total */}
                        <div className="flex justify-between mt-6 text-2xl font-bold">
                            <p>Total:</p>
                            <p>${cart.total.toFixed(2)}</p>
                        </div>

                        <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
                            Checkout
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
}
