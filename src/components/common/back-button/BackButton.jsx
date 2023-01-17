import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import './BackButton.css';

export const BackButton = ({ to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button className="Back-Button">
        <IoIosArrowBack fontSize={20} />
        <span>Back</span>
      </button>
    </Link>
  );
};
