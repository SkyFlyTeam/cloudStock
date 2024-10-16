import React, { useState, useEffect, useRef } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import BtnAzul from "../../components/BtnAzul";
import './style.css'
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { ApiException } from "../../config/apiException";
import BtnCancelar from "../../components/BtnCancelar";
import { Registro, registrosServices } from "../../services/registrosServices";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FaRegArrowAltCircleRight } from "react-icons/fa";



function Registros() {
    
    let [registrosOperacionais, setRegistrosOperacionais] = useState<any[]>([])

    registrosOperacionais = [
      {
        "Registro_id": 1,
        "Registro_Mensagem": "Valor total: R$ 1320",
        "Registro_Data": "2024-10-14T20:36:09.000Z",
        "Registro_Repsonsavel": "User",
        "Registro_Tipo": "Entrada"
      },
      {
        "Registro_id": 1,
        "Registro_Mensagem": "Valor total: R$ 1320",
        "Registro_Data": "2024-10-14T20:36:09.000Z",
        "Registro_Repsonsavel": "User",
        "Registro_Tipo": "Entrada"
      }
    ]

    
    
    
    // Registro do BD
    const [registros, setRegistros] = useState<Registro[]>([]);
  
     // puxar as informações do banco de dados 
      const fetchRegistros = async () => {
        const result = await registrosServices.getAllRegistros()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
          setRegistros(result);
        }
    }

    useEffect(() => {
        fetchRegistros()
    }, [])

    return (
        <main>

            <h1 className="title">Registros</h1>
            {/* parte do botão  */}
            <Tabs
              defaultActiveKey="home"
              transition={false}
              id="noanim-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Home">
                Tab content for Home
              </Tab>
              <Tab eventKey="profile" title="Profile">
                Tab content for Profile
              </Tab>
              <Tab eventKey="contact" title="Contact" disabled>
                Tab content for Contact
              </Tab>
            </Tabs>

            <FaRegArrowAltCircleRight color="red"/>
        </main>
    )
}

export default Registros