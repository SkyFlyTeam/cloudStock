import React, { useEffect, useState } from "react";
import './BarraSuperior.css';
import { TbCircleCaretLeft, TbClockExclamation } from "react-icons/tb";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Offcanvas from 'react-bootstrap/Offcanvas';
import { Tab, Tabs } from "react-bootstrap";

import  loteIcon  from '../../assets/icons/Simplification.svg'
import { Notificacao, notificacoesServices } from "../../services/notificacaoServices";
import { ApiException } from "../../config/apiException";


const BarraSuperior: React.FC = () => {
  const location = useLocation() // Hook para pegar a rota atual
  const navigate = useNavigate() // Funções para navegar

  // State/Funções do OffCanvas de Notificações
  const [showNotifications, setShowNotifications] = useState(false)

  const handleCloseNotifications = () => setShowNotifications(false)
  const handleShowNotifications = () => setShowNotifications(true)

  // Contagem das notificações
  const [totalCount, setTotalCount] = useState(8); 
  const [todasCount, setTodasCount] = useState(8);       
  const [estoqueCount, setEstoqueCount] = useState(3);  
  const [validadeCount, setValidadeCount] = useState(2);

  // Armazena notificações
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  // Função para buscar todos as notificações
  // const fetchNotificacoes = async () => {
  //   const result = await notificacoesServices.getAllNotificacoes()
  //   if (result instanceof ApiException) {
  //     console.log(result.message)
  //   } else {
  //     setNotificacoes(result);
  //   }
  // }

  // // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  // useEffect(() => {
  //   fetchNotificacoes()
  // }, [])

    return (
      <div className="BarraSuperior">
        <div className="itensleft">
          <Link
            to={'..'}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <TbCircleCaretLeft opacity={0.9} color="#C4C4C4" className="link-icon"/>
          </Link>
          <span>{location.pathname.replace('/', '')}</span>
        </div>
        <div className="itensright">
          {totalCount > 0 ?
            <div className="bell-icon-div" onClick={handleShowNotifications}> 
              <div className="bell-not-cont">{totalCount}</div>
              <FaRegBell className="bell-icon"/> 
            </div>
            : 
            <FaRegBell className="bell-icon"/> 
          }
          <FaRegUser className="user-icon" /> 
        </div>

        <Offcanvas show={showNotifications} onHide={handleCloseNotifications} placement='end'>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Notificações</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Tabs
              defaultActiveKey="todas"
              id="notifications"
              className="mb-3"
            >
              <Tab eventKey="todas" title={
                <div className="title">
                  <span>Todas</span>
                  <div className="not-count">{todasCount}</div>
                </div>
              }>
                <div className="not-item">
                  <img src={loteIcon}></img>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 unidades restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
                <div className="not-item">
                  <TbClockExclamation className="icon-clock"/>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 dias restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
                <div className="not-item">
                  <img src={loteIcon}></img>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 unidades restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
                <div className="not-item">
                  <TbClockExclamation className="icon-clock"/>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 dias restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
                <div className="not-item">
                  <img src={loteIcon}></img>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 unidades restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
                <div className="not-item">
                  <TbClockExclamation className="icon-clock"/>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 dias restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="estoque" title={
                <div className="title">
                  <span>Estoque</span>
                  <div className="not-count">{estoqueCount}</div>
                </div>
              }>
                <div className="not-item">
                  <img src={loteIcon}></img>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 unidades restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="validade" title={
                <div className="title">
                  <span>Validade</span>
                  <div className="not-count">{validadeCount}</div>
                </div>
              }>
                <div className="not-item">
                  <TbClockExclamation className="icon-clock"/>
                  <div className="content">
                    <span><b>Lote AFEGX1</b> do <b>Produto1</b> atingiu o estoque mínimo</span>
                    <span className="subtitle">15 dias restantes</span>
                    <span className="date">23/10/2024 - 10:04</span>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Offcanvas.Body>
        </Offcanvas>
      
      </div>


    );
}

    
    

export default BarraSuperior;