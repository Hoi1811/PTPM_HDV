import React from 'react';
import './NewCars.style.css';
import Carousel from 'react-material-ui-carousel';
import fc1 from '../assets/mustang.avif';
import fc2 from '../assets/tesla.jpg';
import fc3 from '../assets/bmw.jpg';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

export const NewCars = () => {
  const theme = useSelector((state) => state.theme.value);

  const cars = [
    { 
      id: 1, 
      title: "2024 Ford Mustang", 
      prize: "$28,000", 
      year: "2024", 
      pretitle: "The all-new Mustang is ready to unleash unparalleled performance and style.", 
      image: fc1 
    },
    { 
      id: 2, 
      title: "2024 Tesla Model S Plaid", 
      prize: "$120,000", 
      year: "2024", 
      pretitle: "Experience the fastest accelerating electric car with cutting-edge technology.", 
      image: fc2 
    },
    { 
      id: 3, 
      title: "2024 BMW i7", 
      prize: "$120,000", 
      year: "2024", 
      pretitle: "The future of luxury is here with the new BMW i7, offering a fully electric experience.", 
      image: fc3 
    },
    { 
      id: 4, 
      title: "2024 Audi Q8 e-tron", 
      prize: "$75,000", 
      year: "2024", 
      pretitle: "An electrifying combination of luxury and performance in Audi's latest electric SUV.", 
      image: fc1 
    },
    { 
      id: 5, 
      title: "2024 Mercedes-Benz EQS", 
      prize: "$102,000", 
      year: "2024", 
      pretitle: "Mercedes' flagship electric sedan, combining luxury and sustainability.", 
      image: fc2 
    }
  ];

  const Cars = ({ car }) => {
    return (
      <div className="car">
        <div className="car__icon">
          <img src={car.image} alt={car.title} />
        </div>
        <div className="car__text">
          <h2><a href="#">{car.title}</a></h2>
          <p>{car.pretitle}</p>
          <p><strong>Year:</strong> {car.year}</p>
          <p><strong>Price:</strong> {car.prize}</p>
          <Button className="car__btn" variant="contained">View Details</Button>
        </div>
      </div>
    );
  };

  return (
    <section style={{ background: theme }} id="cars" className="cars">
      <div className="cars__container">
        <div className="cars__title">
          <h2>Những chiếc xe mới được ra mắt</h2>
        </div>
        <div className="cars__content">
          <Carousel>
            {cars.map((car) => (
              <Cars key={car.id} car={car} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};
