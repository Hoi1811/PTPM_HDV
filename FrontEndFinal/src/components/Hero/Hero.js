import React from 'react'
import './Hero.style.css';
import { Header } from '../Header/Header';
import { useSelector } from 'react-redux'


export const Hero = () => {
    const theme = useSelector((state) => state.theme.value)
    console.log(theme)
    return (
        <>
            <Header />
            <section id="hero" class="hero">
                <div class="hero__container">
                    <div class="hero__txt">
                        <h2 style={{ color: theme }}>Tiếp nhiên liệu cho đam mê, lái xe theo ước mơ của bạn </h2>
                        <p style={{ color: theme }}>

                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}
