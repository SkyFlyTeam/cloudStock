import React from 'react';
import './style.css'

interface Props {
  label?: string; // Recebe texto
  className?: string; // Classes para 'div' base
}

const DivTitulo: React.FC<Props> = ({ className, label }) => {

  return (
    <div className="{className} divtitulo">
      <h3 className="divtitulo">{label}</h3>
      <hr className="line divtitulo"></hr>
    </div>
  );
};

export default DivTitulo;