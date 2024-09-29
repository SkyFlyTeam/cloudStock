import React, { ReactNode, useState } from 'react';
import BtnCancelar from '../BtnCancelar';
import { IoAddCircleOutline } from "react-icons/io5";
import './style.css';
import BtnAzul from '../BtnAzul';

interface ModalProps {
  isOpen: boolean;
  setModalOpen: () => void;
  children: ReactNode;
  label: string;
  buttons?: ReactNode; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, setModalOpen, label, children, buttons }) => {
  const [openModal, setOpenModal] = useState(false);

  if (isOpen) {
    return (
      <div className='backgroundStyle'>
        <div className='modalStyle'>
          <h1 className='title'>{label}</h1>
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