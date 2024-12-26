import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import { FeaturedCars } from "../components/FeaturedCars/FeaturedCars";
import { Reviews } from "../components/Reviews/Reviews";
import { Footer } from "../components/Footer/Footer";
import { NewCars } from "../components/NewCars/NewCars";
import TopCarChart from "../components/topCar/topCarChart";
// import SearchCar from "../components/SearchCar/SearchCar";
const Admin = () => {
    const [selectedCars, setSelectedCars] = useState([]);
    const servicesRef = useRef(null);
    const location = useLocation();
    const featuredCarsRef = useRef(null);
    const topCarChartRef = useRef(null);
    const reviewsRef = useRef(null);
    const heroRef = useRef(null);
    const newCarsRef = useRef(null);

    useEffect(() => {
        const hash = location.hash.slice(1); // Remove the # symbol
        const refMap = {
            services: servicesRef,
            featuredCars: featuredCarsRef,
            topCar: topCarChartRef,
            reviews: reviewsRef,
            home: heroRef,
            cars: newCarsRef
        };

        const targetRef = refMap[hash];
        if (targetRef?.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.hash]);

    const handleAddCarToComparison = (car) => {
        if (selectedCars.length < 4 && !selectedCars.includes(car)) {
            setSelectedCars([...selectedCars, car]);
        }
    };

    return (
        <>
            <Hero ref={heroRef} id="hero" />
            <NewCars ref={newCarsRef} id="cars" />
         
            <FeaturedCars 
                ref={featuredCarsRef}
                id="featuredCars"
                onAddCarToComparison={handleAddCarToComparison}
            />
            <Services
                ref={servicesRef}
                id="services"
                selectedCars={selectedCars}
                onRemoveCar={(carId) => {
                    setSelectedCars((prev) => prev.filter((car) => car.id !== carId));
                }}
            />
            <TopCarChart ref={topCarChartRef} id="topCar"/>
            <Reviews ref={reviewsRef} id="reviews"/>
            <Footer/>
        </>
    );
};

export default Admin;