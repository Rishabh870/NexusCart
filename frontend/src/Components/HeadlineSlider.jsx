import React from "react";
import styled from "styled-components";
import Bg from "../Img/Background.jpg";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopImage = styled.div`
  position: relative;
  width: 100%;
`;

const CoverSection = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  background-image: url(${Bg});
  background-size: cover;
  background-position: 0%;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(
      0,
      0,
      0,
      0.4
    ); /* Adjust the alpha value to control darkness */
  }
`;

const CoverLogo = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  &:hover {
    transform: translate(-50%, -50%) scale(1.1); /* Scale the element up by 10% on hover */
  }
`;

const Slogan = styled.p`
  color: var(--primary);
  font-size: 1.5rem;
  text-align: center;
  z-index: 1;
  text-shadow: 2px 2px 4px black;
  font-family: "Lato", cursive;
`;

const Title = styled.h3`
  font-family: "Playfair Display SC";
  text-shadow: 2px 2px 4px black;
  color: white;
  font-size: 3rem;
`;
const HeroSection = () => {
  return (
    <>
      <Container>
        <TopImage>
          <CoverSection>
            <CoverLogo>
              <Title>NexusCart</Title>
              <Slogan style={{ fontFamily: "Playfair Display, serif" }}>
                Where shopping meets convenience.
              </Slogan>
            </CoverLogo>
          </CoverSection>
        </TopImage>
      </Container>
    </>
  );
};

export default HeroSection;
