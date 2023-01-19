import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <Link to={'/'}>
      <header className={'Header'}>
        <img src="VWBL_EDUCATION_LOGO.svg" alt="Header_Logo" />
      </header>
    </Link>
  );
};
