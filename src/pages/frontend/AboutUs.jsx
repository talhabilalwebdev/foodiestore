import img1 from "../../assets/img/img1.jpg";
import React from "react";
import Button from "../../layouts/Button";
import img7 from "../../assets/img/about.png";

export default function AboutUs() {
  return (
    <div>
      <div className="h-[50vh] flex items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat">
        <div className="w-full lg:w-2/3 space-y-5 text-left">
          <h1 className="text-backgroundColor font-semibold text-6xl">
            About Foodie Store
          </h1>
          <p className="text-backgroundColor">
            Discover the story behind Foodie Store and our passion for bringing fresh, exciting meals to your table every day.
          </p>
        </div>
      </div>

      {/* Why Choose Us? */}

      <div className="flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5 p-14">
        <img src={img7} alt="img" />

        <div className=" space-y-4">
          <h2 className=" font-semibold text-4xl text-center md:text-start">
            Our Story
          </h2>
          <p>
            Food is more than just a meal—it’s an experience. 
            We started with the idea of making dining exciting by offering different dishes every day. 
            From comfort classics to modern flavors, our rotating menu ensures there’s always something new to try, prepared with care and delivered with love.
          </p>
          <div className=" flex justify-center lg:justify-start">
            <Button title="Learn More" to="/#menu"/>
          </div>
        </div>
      </div>
    </div>
  );
}
