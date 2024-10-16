import React from "react"

import './style.css'
import BtnAzul from "../../components/BtnAzul"
import InputBusca from "../../components/InputBusca"
import { IoAddCircleOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';
import Listagem from "../../components/Listagem"

function EntradasRegistro() {
    // 
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Entradas');
    };

    const data = [
        { codigo: '00001', valorTotal: 'R$250,00' },
        { codigo: '00002', valorTotal: 'R$1998,99' },
        { codigo: '00003', valorTotal: 'R$1250,00' },
        { codigo: '00004', valorTotal: 'R$90,00' },
      ];
      
      const columns = [
        { header: 'Código', key: 'codigo' },
        { header: 'Valor total', key: 'valorTotal' },
      ];

    return (
        <main>
            <h1 className="title">Entrada</h1>

            <div className="inputButton">
                <InputBusca />
                <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={handleRedirect} />
            </div>

            <Listagem data={data} columns={columns} />;

        </main>
    )
}

export default EntradasRegistro