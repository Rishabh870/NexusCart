import React from 'react';
import styled from 'styled-components';

const ReviewCardContainer = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  @media (max-width: 576px) {
    margin-bottom: 10px;
  }
`;

const ReviewText = styled.span`
  flex: 1;
  text-align: right;
  @media (max-width: 576px) {
    text-align: left;
  }
`;

const BottomSection = styled.div`
  margin-top: 10px;
`;

const UserReview = styled.p`
  @media (max-width: 576px) {
    text-align: justify;
  }
`;
const StarContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const Star = styled.span`
  cursor: pointer;
  height: fit-content;
  color: ${({ filled }) => (filled ? 'gold' : 'grey')};
`;
const ReviewCard = ({ userName, reviewText, stars }) => {
  // console.log(reviewText);
  return (
    <ReviewCardContainer>
      <TopSection>
        <UserName>{userName}</UserName>
        <ReviewText>
          <StarContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} filled={star <= stars}>
                &#9733;
              </Star>
            ))}
          </StarContainer>
        </ReviewText>
      </TopSection>
      <BottomSection>
        <UserReview className='m-0'>{reviewText}</UserReview>
      </BottomSection>
    </ReviewCardContainer>
  );
};

export default ReviewCard;
