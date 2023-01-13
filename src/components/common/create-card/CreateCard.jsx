import React from 'react';
import './CreateCard.css';
import { Link } from 'react-router-dom';

export const CreateCard = () => {
  return (
    <div className="Create-Card">
      <Link to={'/new/'}>
        <button className="Create-Button">＋ Create</button>
      </Link>
    </div>
  );
};
