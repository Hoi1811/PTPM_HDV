import React from 'react'
import './Reviews.style.css';
import c1 from '../assets/c1.png';
import c2 from '../assets/c2.png';
import c3 from '../assets/c3.png';

export const Reviews = () => {

  const reviews = [{ name: "largest dealership", review: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut den fugit sed quia. ", image: c1 },
  { name: "largest dealership", review: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut den fugit sed quia. ", image: c2 }, { name: "largest dealership", review: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut den fugit sed quia. ", image: c3 }]


  const Review = ({ review }) => {
    return (
      <div class="single-review-item">
        <div class="single-review-icon">
          <img src={review.image} />
        </div>
        <p>
          {review.review}
        </p>
        <h2><a href="#">{review.name}</a></h2>
      </div>
    )

  }
  return (
    <section id="review" class="review">
      <div class="container">
        <div class="title">
          <h2>Những nhà phát triển</h2>
        </div>
        <div class="review-content">
          {reviews.map((review) => (
            <Review review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
