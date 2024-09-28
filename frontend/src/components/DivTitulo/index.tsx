import React from 'react';
import './style.css'

interface Props {
  className: string;
  title: string;
}

const DivTitulo: React.FC<Props> = ({ className, title }) => {

  return (
    <div className="{className} divtitulo">
      <h3 className="divtitulo">{title}</h3>
      <hr className="line divtitulo"></hr>
    </div>
  );
};

export default DivTitulo;