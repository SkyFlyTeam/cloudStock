import React, { ReactNode } from 'react';
import './style.css'

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="cards">
      {children}
    </div>
  );
};

export default Card;