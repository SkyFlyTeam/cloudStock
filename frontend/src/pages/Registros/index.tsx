import React, { useState, useEffect } from "react";
import { ApiException } from "../../config/apiException";
import { Registro, registrosServices } from "../../services/registrosServices";
import { FaRegArrowAltCircleRight } from "react-icons/fa"; // Importando o ícone
import './style.css';
import { BsLink45Deg } from "react-icons/bs";

function Registros() {
  const registrosOperacionais = [
    {
      "Registro_id": 1,
      "Registro_Mensagem": "Valor total: R$1320",
      "Registro_Data": "2024-10-14T20:36:09.000Z",
      "Registro_Responsavel": "User",
      "Registro_Tipo": "Entrada"
    },
    {
      "Registro_id": 2,
      "Registro_Mensagem": "Valor total: R$1320",
      "Registro_Data": "2024-10-14T20:36:09.000Z",
      "Registro_Responsavel": "User",
      "Registro_Tipo": "Saida"
    }
  ];

  const [registros, setRegistros] = useState<Registro[]>([]);

  const fetchRegistros = async () => {
    const result = await registrosServices.getAllRegistros();
    if (result instanceof ApiException) {
      console.log(result.message);
    } else {
      setRegistros(result);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // Função para retornar a cor e ícone baseado no tipo de registro
  const getIconStyle = (tipo: string) => {
    return tipo === "Entrada" ? { color: "#2ecc71" } : { color: "#C80000" }; // Verde para Entrada, Vermelho para Saída
  };
  {registrosOperacionais.map((registro) => {
    const tipoComAcento = registro.Registro_Tipo === "Saida" ? "Saída" : registro.Registro_Tipo;
  
    return (
      <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
        <FaRegArrowAltCircleRight className="icon" style={getIconStyle(registro.Registro_Tipo)} />
        <div className="info">
          <div className="info-title">
            <h2>{tipoComAcento}</h2>
            <BsLink45Deg color="#61BDE0" size={25} />
          </div>
          <div className="info-body">
            <span>{registro.Registro_Mensagem}</span>
            <span>Responsável: {registro.Registro_Responsavel} - {new Date(registro.Registro_Data).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  })}
  
  return (
    <main>
      <h1 className="title">Registros</h1>
      <div className="registros-container">
        {registrosOperacionais.map((registro) => {
          return (
            <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
              <FaRegArrowAltCircleRight className="icon" style={getIconStyle(registro.Registro_Tipo)} />
              <div className="info">
                <div className="info-title">
                  <h2>{registro.Registro_Tipo}</h2>
                  <BsLink45Deg color="#61BDE0" size={25} />
                </div>
                <div className="info-body">
                  <span>{registro.Registro_Mensagem}</span>
                  <span>Responsável: {registro.Registro_Responsavel} - {new Date(registro.Registro_Data).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Registros

