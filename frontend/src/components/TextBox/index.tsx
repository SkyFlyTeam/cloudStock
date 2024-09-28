import React from 'react';
import './style.css'

interface Props {
  className: string;
  name: string;
  title: string;
  value: string; // Adiciona prod_cod como prop
}

const TextBox: React.FC<Props> = ({ className, name, title, value }) => {

  return (
    <div className={className}>
      <label htmlFor={name}>{title}</label><br/>

      <input className="textbox"
        type="text"
        id={name}
        name={name}
        placeholder={value}
      />
    </div>
  );
};

export default TextBox;