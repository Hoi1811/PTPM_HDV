
import React from 'react';
import './NewCars.style.css';
import Carousel from 'react-material-ui-carousel';
import fc1 from '../assets/ncm1.png';
import fc2 from '../assets/ncm2.png';
import fc3 from '../assets/ncm3.png';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

export const NewCars = () => {
  const theme = useSelector((state) => state.theme.value);

  const cars = [
    { id: 1, title: "BMW 6-Series Gran Coupe", prize: "$89,395", year: "2017", pretitle: "Experience the ultimate luxury ride with unparalleled performance.", image: fc1 },
    { id: 2, title: "Mercedes-Benz E-Class", prize: "$65,000", year: "2024", pretitle: "Unmatched elegance and top-tier engineering for your comfort.", image: fc2 },
    { id: 3, title: "Audi A8 L", prize: "$75,000", year: "2022", pretitle: "Sophistication and innovation combined in a premium vehicle.", image: fc3 },
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
