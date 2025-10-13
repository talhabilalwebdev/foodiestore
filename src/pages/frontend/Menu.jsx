import React from "react";
import Button from "../../layouts/Button";
import DishesCard from "../../layouts/DishesCard";
import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import img5 from "../../assets/img/img5.jpg";
import img6 from "../../assets/img/img6.jpg";

export default function Menu() {
    return (
        <div>
            <div className=" min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat ">
                <div className=" w-full lg:w-2/3 space-y-5">
                    <h1 className=" text-backgroundColor font-semibold text-6xl">
                        Elevate Your Inner Foodie with Every Bite.
                    </h1>
                    <p className=" text-backgroundColor">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis et qui,
                        maxime assumenda repellat corrupti officia dolorum delectus labore
                        deleniti?
                    </p>
                    <div className=" flex justify-center lg:justify-start">
                        <Button title="Order Now" to="/menu"/>
                    </div>
                </div>
            </div>

            {/* Our Dishes */}
            <div className=" min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 pb-10">
                <h2 className=" text-4xl font-semibold text-center p-10">
                    Our Dishes
                </h2>

                <div className=" flex flex-wrap gap-8 justify-center">
                    <DishesCard img={img1} title="Tasty Dish" price="$10.99" />
                    <DishesCard img={img2} title="Tasty Dish" price="$12.99" />
                    <DishesCard img={img3} title="Tasty Dish" price="$10.99" />
                    <DishesCard img={img4} title="Tasty Dish" price="$11.99" />
                    <DishesCard img={img5} title="Tasty Dish" price="$10.99" />
                    <DishesCard img={img6} title="Tasty Dish" price="$12.99" />
                </div>
            </div>

            

        </div>
    )
}
