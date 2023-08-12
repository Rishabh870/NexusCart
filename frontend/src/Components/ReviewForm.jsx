import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { publicRequest, userRequest } from "../requestMethods";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import { toast } from "react-toastify";

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
  color: ${({ filled }) => (filled ? "#ffcc00" : "#ccc")};
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

const RatingForm = ({ update, setUpdate }) => {
  const { productId } = useParams(); // Get the productId from the URL params
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submited, setSubmited] = useState(false);
  const [averageRating, setAverageRating] = useState(0.0);
  const [reviews, setReviews] = useState([]);

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  // Function to calculate the average rating

  useEffect(() => {
    // Function to fetch reviews and update average rating

    const fetchReviews = async () => {
      try {
        const response = await publicRequest.get(
          `/review/getreviews/${productId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [submited, productId, update, averageRating, reviews.length]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      return;
    }
    const userId = localStorage.getItem("userId");

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
      setUpdate(!update);
      toast.success("Review Added");
    } catch (error) {
      toast.error(error.response.data.error);
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
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment"
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          userName={review.userId?.fullName}
          reviewText={review.review}
          stars={review.stars}
        />
      ))}
    </Container>
  );
};

export default RatingForm;
