import React from "react";
import styled from "styled-components";

const HamWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  cursor: pointer;
  z-index: 1; /* Ensure the hamburger icon is on top of other content */
  margin: 0; /* Remove any margins */
  @media (max-width: 775px) {
    /* Show the hamburger icon only on screens smaller than 775px */
    display: block;
    margin-top: 20px;
  }
  @media (min-width: 776px) {
    /* Hide the hamburger icon on screens larger than or equal to 776px */
    display: none;
  }
`;

const HamIcon = styled.i`
  font-size: 30px; /* Increase the size of the icon */
  color: #000; /* Set the color of the icon to white */
  margin-bottom: 10px
`;

const Ham = ({ open, handleClick }) => {
  return (
    <HamWrapper onClick={handleClick}>
      {open ? (
        <HamIcon className="fas fa-align-center"></HamIcon>
      ) : (
        <HamIcon className="fa-solid fa-bars"></HamIcon>
      )}
    </HamWrapper>
  );
};

export default Ham;
