import React from 'react';
import './style.css';

interface BtnAzulProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const BtnAzul: React.FC<BtnAzulProps> = ({ onClick, icon, label }) => {
    return (
        <button className='btn-azul' onClick={onClick}>
            <span className='icon'>{icon}</span>
            <span className='label'>{label}</span>
        </button>
    );
}

export default BtnAzul;


/*

---- USANDO O COMPONENTE 
import BtnAzul from "../../components/BtnAzul";

---- BOTÃO DE CADASTRAR
import { IoAddCircleOutline } from "react-icons/io5";
<BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={() => {}} />

---- BOTÃO DE VOLTAR
import { IoArrowBackCircleOutline } from "react-icons/io5";
<BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => {}} />

---- BOTÃO DE CONCLUIR
import { IoCheckmarkCircleOutline } from "react-icons/io5";
<BtnAzul icon={<IoCheckmarkCircleOutline />} label='CONCLUIR' onClick={() => {}} />

*/

