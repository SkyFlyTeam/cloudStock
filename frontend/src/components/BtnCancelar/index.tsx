import React from 'react';
import './style.css';

interface BtnCancelarProps {
    onClick: () => void; // Recebe a função para abrir/fechar o modal

}

const BtnCancelar: React.FC<BtnCancelarProps> = ({ onClick }) => {
    return (
        <button className='btn-cancelar' onClick={onClick}>
            CANCELAR
        </button>

    );
}

export default BtnCancelar;


