import React, { ReactNode, useState } from 'react';
import BtnCancelar from '../BtnCancelar';
import { IoAddCircleOutline } from "react-icons/io5";
import './style.css';
import BtnAzul from '../BtnAzul';

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  label: string;
  buttons?: ReactNode; 
  id?: number | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, label, children, buttons, id }) => {

  if (isOpen) {
    return (
      <div className='backgroundStyle'>
        <div className='modalStyle'>
          <h1 className='title'>{label}<span className='title-id'>{id}</span></h1>
          <div className='content'>{children}</div>

          <div className='buttonContainer'>
            {buttons} 
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Modal;