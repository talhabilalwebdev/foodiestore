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
            .get("http://localhost:5000/api/fdishes")
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
            
        </div>
    );
}
