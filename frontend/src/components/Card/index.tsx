import React, { ReactNode } from 'react';
import './style.css'

interface CardProps {
  children: ReactNode;
  className?: string 
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`cards ${className}`}>
      {children}
    </div>
  );
};

export default Card;