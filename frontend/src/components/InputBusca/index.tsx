import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5'; 
import './style.css';

const InputBusca: React.FC = () => {
    const [buscaTerm, setbuscaTerm] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setbuscaTerm(event.target.value);
    };

    return (
        <div className="busca-container">
            <input
                type="text"
                className="busca-input"
                placeholder="Buscar..."
                value={buscaTerm}
                onChange={handleInputChange}
            />
            <button className="busca-button">
                <IoSearchOutline />
            </button>
        </div>
    );
};

export default InputBusca;
