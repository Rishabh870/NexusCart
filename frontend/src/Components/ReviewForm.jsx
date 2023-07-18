import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { publicRequest, userRequest } from '../requestMethods';
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';

const FormContainer = styled.form`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const StarContainer = styled.div`
  display: flex;
  border: 2px solid black;
  border-right: none;
  padding: 0.25rem 10px;
  margin-left: 0;
`;
const Container = styled.div``;

const Star = styled.span`
  cursor: pointer;
  font-size: 24px;
  color: ${({ filled }) => (filled ? '#ffcc00' : '#ccc')};
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  border: 2px solid black;
  border-right: none;
  border-left: none;
  outline: none;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #ffffff;
  font-weight: 500;
  color: #000000;
  border: 2px solid black;
  border-left: none;
  cursor: pointer;
`;

const RatingForm = () => {
  const { productId } = useParams(); // Get the productId from the URL params
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submited, setSubmited] = useState(false);
  const [averageRating, setAverageRating] = useState(0.0);
  const [reviews, setReviews] = useState([]);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  // Function to calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;

    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
    const averageRating = totalStars / reviews.length;
    return averageRating.toFixed(1);
  };

  useEffect(() => {
    // Function to fetch reviews and update average rating
    const fetchReviews = async () => {
      try {
        const response = await publicRequest.get(
          `/review/getreviews/${productId}`
        );
        setReviews(response.data);

        // Calculate the average rating and update state
        const averageRating = calculateAverageRating(response.data);
        setAverageRating(averageRating);
        console.log(averageRating);
        try {
          await userRequest.put(`/product/updatereview/${productId}`, {
            review: averageRating,
          });
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [submited]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      return;
    }
    const userId = localStorage.getItem('userId');

    const data = {
      stars: rating,
      userId,
      review: comment,
    };

    try {
      const response = await userRequest.post(
        `/review/addreview/${productId}`,
        data
      );
    } catch (error) {
      console.error(error);
    }

    setSubmited(!submited);
  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <StarContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= rating}
              onClick={() => handleStarClick(star)}
            >
              &#9733;
            </Star>
          ))}
        </StarContainer>
        <Input
          type='text'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Enter your comment'
        />
        <SubmitButton type='submit'>Submit</SubmitButton>
      </FormContainer>
      {reviews.map((review) => (
        // console.log(review),
        <ReviewCard
          key={review.id}
          userName={review.userId.fullName}
          reviewText={review.review}
          stars={review.stars}
        />
      ))}
    </Container>
  );
};

export default RatingForm;
