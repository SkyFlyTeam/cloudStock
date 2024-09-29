import React, { ReactNode } from 'react';
import './style.css'

interface Props {
  children: ReactNode // Permite que recebe componentes/conteudo 
  className?: string // Permite que haja mais classes além de card
}

const Card: React.FC<Props> = ({ children, className  }) => {
  return (
    <div className={`cards ${className}`}>
      {children}
    </div>
  );
};

export default Card;