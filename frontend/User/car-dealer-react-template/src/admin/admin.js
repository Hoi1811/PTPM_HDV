import React, { useState, useRef } from "react";
import { Hero } from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import { FeaturedCars } from "../components/FeaturedCars/FeaturedCars";
import { Reviews } from "../components/Reviews/Reviews";
import { Footer } from "../components/Footer/Footer";
import { NewCars } from "../components/NewCars/NewCars";

import TopCarChart from "../components/topCar/topCarChart";

const Admin = () => {
    const [selectedCars, setSelectedCars] = useState([]);
    const servicesRef = useRef(null); // Tạo ref để cuộn đến phần Services

    // Hàm thêm xe vào bảng so sánh
    const handleAddCarToComparison = (car) => {
        console.log('Adding car in Admin:', car); // Log xe được truyền từ FeaturedCars
        if (selectedCars.length < 4 && !selectedCars.includes(car)) {
            setSelectedCars([...selectedCars, car]);
        } else {
            console.log('Car already selected or limit reached.');
        }
    };
    return (
        <>
            <Hero />
            <NewCars />
            <FeaturedCars
                onAddCarToComparison={handleAddCarToComparison}
                scrollToServices={() => {
                    if (servicesRef.current) servicesRef.current.scrollIntoView({ behavior: "smooth" });
                }} Truyền hàm cuộn trang
            />
            <Services
                ref={servicesRef} // Gán ref vào phần Services
                selectedCars={selectedCars}
                onRemoveCar={(carId) => {
                    // Loại bỏ xe khỏi selectedCars và filteredServices
                    setSelectedCars((prev) => prev.filter((car) => car.id !== carId));
                }}
            />
            <TopCarChart />
            <Reviews />
            <Footer />
        </>
    );
};

export default Admin;
