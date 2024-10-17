// import React, { useState, useEffect } from "react";
// import { ApiException } from "../../config/apiException";
// import { Registro, registrosServices } from "../../services/registrosServices";
// import './style.css';
 
// function Registros() {
 
//   const registrosOperacionais = [
//     {
//       "Registro_id": 1,
//       "Registro_Mensagem": "Valor total: R$ 1320",
//       "Registro_Data": "2024-10-14T20:36:09.000Z",
//       "Registro_Responsavel": "User",
//       "Registro_Tipo": "Entrada"
//     },
//     {
//       "Registro_id": 2,
//       "Registro_Mensagem": "Valor total: R$ 1320",
//       "Registro_Data": "2024-10-14T20:36:09.000Z",
//       "Registro_Responsavel": "User",
//       "Registro_Tipo": "Entrada"
//     }
//   ];
 
//   const [registros, setRegistros] = useState<Registro[]>([]);
 
//   // Função para puxar as informações do banco de dados
//   const fetchRegistros = async () => {
//     const result = await registrosServices.getAllRegistros();
//     if (result instanceof ApiException) {
//       console.log(result.message);
//     } else {
//       setRegistros(result);
//     }
//   };
 
//   useEffect(() => {
//     fetchRegistros();
//   }, []);
 
//   return (
//     <main>
//       <h1 className="title">Registros</h1>
//       <div className="registros-container">
//         {registrosOperacionais.map((registro) => {
//           return (
//             <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
//               <h2>Registro #{registro.Registro_id}</h2>
//               <p>{registro.Registro_Mensagem}</p>
//               <p>Data: {new Date(registro.Registro_Data).toLocaleString()}</p>
//               <p>Responsável: {registro.Registro_Responsavel}</p>
//               <p>Tipo: {registro.Registro_Tipo}</p>
//             </div>
//           );
//         })}
//       </div>
//     </main>
//   );
// }
 
// export default Registros;
import React, { useState, useEffect } from "react";
import { ApiException } from "../../config/apiException";
import { Registro, registrosServices } from "../../services/registrosServices";
import { FaRegArrowAltCircleRight } from "react-icons/fa"; // Importando o ícone
import './style.css';

function Registros() {
  const registrosOperacionais = [
    {
      "Registro_id": 1,
      "Registro_Mensagem": "Valor total: R$ 1320",
      "Registro_Data": "2024-10-14T20:36:09.000Z",
      "Registro_Responsavel": "User",
      "Registro_Tipo": "Entrada"
    },
    {
      "Registro_id": 2,
      "Registro_Mensagem": "Valor total: R$ 1320",
      "Registro_Data": "2024-10-14T20:36:09.000Z",
      "Registro_Responsavel": "User",
      "Registro_Tipo": "Saída"
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
    return tipo === "Entrada" ? { color: "#2ecc71" } : { color: "#ff6b6b" }; // Verde para Entrada, Vermelho para Saída
  };

  return (
    <main>
      <h1 className="title">Registros</h1>
      <div className="registros-container">
        {registrosOperacionais.map((registro) => {
          return (
            <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
              <FaRegArrowAltCircleRight className="icon" style={getIconStyle(registro.Registro_Tipo)} />
              <div className="info">
                <h2>Registro #{registro.Registro_id}</h2>
                <p>{registro.Registro_Mensagem}</p>
                <p>Data: {new Date(registro.Registro_Data).toLocaleString()}</p>
                <p>Responsável: {registro.Registro_Responsavel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Registros;
