import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../layouts/Button";
import DishesCard from "../../layouts/DishesCard";
import ReviewCard from "../../layouts/ReviewCard";
import img7 from "../../assets/img/about.png";
import img8 from "../../assets/img/pic1.png";
import img9 from "../../assets/img/pic2.png";
import img10 from "../../assets/img/pic3.png";

export default function Home() {
    const [dishes, setDishes] = useState([]);
    const [today, setToday] = useState(""); // store today's day name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dishes from Flask API
    useEffect(() => {
        axios
            .get("https://foodiebackend-1-ef18.onrender.com/api/fdishes")
            .then((res) => {
                setDishes(res.data.dishes); // access dishes array
                setToday(res.data.today);   // access today name
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching dishes:", err);
                setError("Failed to load dishes.");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
                <div className="w-full lg:w-2/3 space-y-5">
                    <h1 className="text-backgroundColor font-semibold text-6xl">
                        Delicious Dishes, Every Day For You
                    </h1>
                    <p className="text-backgroundColor">
                        Foodie Store bring you a new variety of delicious meals daily. 
                        Order online, explore our changing menu, and enjoy freshly prepared dishes delivered right to your doorstep.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <a title="Order Now" href="#menu" className="px-6 py-1 border-2 border-brightColor text-brightColor hover:bg-brightColor hover:text-white transition-all rounded-full">Order Now</a>
                    </div>
                </div>
            </div>

            {/* Our Dishes */}
            <div className="flex flex-col justify-center items-center lg:px-32 px-5" id="menu">
                <h2 className="text-4xl font-semibold text-center p-10">
                    {today} Menu
                </h2>

                {loading && <p className="text-gray-500">Loading dishes...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-wrap gap-8 justify-center">
                    {dishes.length > 0 ? (
                        dishes.map((dish) => (
                            <DishesCard
                                key={dish._id}
                                img={dish.img}
                                title={dish.title}
                                price={dish.price}
                                dish={dish}   // 👈 pass whole dish
                            />
                        ))
                    ) : (
                        !loading && !error && (
                            <p className="text-gray-500">No dishes available.</p>
                        )
                    )}
                </div>
            </div>

            {/* Why Choose Us? */}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5 p-10">
                <img src={img7} alt="img" />

                <div className="space-y-4 lg:pt-14">
                    <h2 className="font-semibold text-4xl text-center md:text-start">
                        Who We Are
                    </h2>
                    <p>
                        Foodie Store is your go-to online food destination, offering a unique menu that changes every day. 
                        We focus on fresh ingredients, great taste, and convenience so you can enjoy different flavors without repeating the same meals.
                    </p>
                    <p>
                        From comfort classics to modern flavors, our rotating menu ensures there’s always something new to try, prepared with care and delivered with love.
                    </p>
                    <div className="flex justify-center lg:justify-start">
                        <Button title="Learn More" />
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            {/* <div className="min-h-screen flex flex-col items-center justify-center md:px-32 px-5">
                <h2 className="text-4xl font-semibold text-center p-10">
                    Customer's Review
                </h2>
                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <ReviewCard img={img8} name="Sophia Azura" />
                    <ReviewCard img={img9} name="John Deo" />
                    <ReviewCard img={img10} name="Victoria Zoe" />
                </div>
            </div> */}
        </div>
    );
}
