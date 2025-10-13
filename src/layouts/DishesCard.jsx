import React from "react";
import { useCart } from "../context/CartContext";


export default function DishesCard({ img, title, price, dish }) {
  const { addToCart } = useCart();

  return (
    <div className="w-full lg:w-1/4 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg">
      <img className="rounded-xl" src={img} alt={title} />
      <div className="space-y-4">
        <h3 className="font-semibold text-center text-xl pt-6">{title}</h3>
        {/* Star Rating Example */}
        {/* <div className="flex flex-row justify-center">
          <BsStarFill className="text-brightColor" />
          <BsStarFill className="text-brightColor" />
          <BsStarFill className="text-brightColor" />
          <BsStarFill className="text-brightColor" />
          <BsStarHalf className="text-brightColor" />
        </div> */}
        <div className="flex flex-row items-center justify-center gap-4">
          <h3 className="font-semibold text-lg">{price}</h3>
          <button className="px-6 py-1 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full"
            title="Order Now"
            onClick={() => addToCart(dish)}
          >Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
