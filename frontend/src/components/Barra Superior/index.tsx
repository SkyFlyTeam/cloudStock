import React, { useEffect, useRef, useState } from "react";
import './BarraSuperior.css';
import { TbCircleCaretLeft, TbClockExclamation } from "react-icons/tb";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Offcanvas from 'react-bootstrap/Offcanvas';
import { Tab, Tabs } from "react-bootstrap";

import  loteIcon  from '../../assets/icons/Simplification.svg'
import { Notificacao, notificacoesServices } from "../../services/notificacoesServices";
import { ApiException } from "../../config/apiException";


const BarraSuperior: React.FC = () => {
    const location = useLocation() // Hook para pegar a rota atual
    const navigate = useNavigate() // Funções para navegar

    // State/Funções do OffCanvas de Notificações
    const [showNotifications, setShowNotifications] = useState(false)

    const handleCloseNotifications = () => setShowNotifications(false)
    const handleShowNotifications = () => {setShowNotifications(true);console.log('sss')}

    // Armazena notificações
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [notificacoesValidade, setNotificacoesValidade] = useState<Notificacao[]>([]);
    const [notificacoesEstoque, setNotificacoesEstoque] = useState<Notificacao[]>([]);

    // Função para buscar todos as notificações
    const fetchNotificacoes = async () => {
      const result = await notificacoesServices.getAllNotificacoes()
      if (result instanceof ApiException) {
        console.log(result.message)
      } else {
        setNotificacoes(result);
      }
    }

    // Contagem das notificações
    const [totalCount, setTotalCount] = useState(0);      
    const [estoqueCount, setEstoqueCount] = useState(0);  
    const [validadeCount, setValidadeCount] = useState(0);

    // States para controlar o webStocket
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    // Chama a função para pegar todos os fornecedores do BD ao montar o componente
    useEffect(() => {
      fetchNotificacoes()

      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        // Conecta ao WebSocket para atualizações em tempo real
        const socket = new WebSocket('ws://localhost:5000');
        wsRef.current = socket
        setSocket(socket)
        console.log('aberto websocket')

        socket.onmessage = (message) => {
          const data = JSON.parse(message.data);
          console.log('rodando websocket')
          console.log('Notificao', data)
              if (data.action === 'delete') {
                console.log('exlcuindo not')
                  setNotificacoes((prevNotificacoes) => 
                      prevNotificacoes.filter(notificacao => notificacao.Not_id !== data.id)
                  );
              } if (data.action === 'create') {
                  setNotificacoes((prevNotificacoes) => [...prevNotificacoes, data.notificacao]);
              }
        };
      }

      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          console.log('fechando websocket')
          wsRef.current.close()
        }
      }
    }, [])

    // Carrega todas as informações de notificação, separa por tipo e conta
    useEffect(() => {
      setTotalCount(notificacoes.length);
      const estoque = notificacoes.filter((item) => item.Not_tipo === "Estoque");
      const validade = notificacoes.filter((item) => item.Not_tipo === "Validade");
      setNotificacoesEstoque(estoque);
      setNotificacoesValidade(validade);
      setEstoqueCount(estoque.length);
      setValidadeCount(validade.length);

    }, [notificacoes]);

    const formatDate = (dateString: Date) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

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
            <FaRegBell className="bell-icon" onClick={handleShowNotifications}/> 
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
                  <div className="not-count">{totalCount}</div>
                </div>
              }>
                {notificacoes.map((notificacao) => (
                  notificacao.Not_tipo === 'Estoque' ? (
                    <div className="not-item" key={notificacao.Not_id}> 
                      <img src={loteIcon} alt="Lote Icon" />
                      <div className="content">
                        <span> <b>{notificacao.Produto.Prod_nome}</b> atingiu o estoque mínimo</span>
                        <span className="subtitle">{notificacao.Not_mensagem}</span>
                        <span className="date">{formatDate(notificacao.Not_data)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="not-item" key={notificacao.Not_id}> 
                      <TbClockExclamation className="icon-clock"/>
                      <div className="content">
                        <span>Lote <b>{notificacao.Lote?.Lote_cod}</b> de <b>{notificacao.Produto?.Prod_nome}</b> está próximo ao vencimento</span>
                        {notificacao.Not_mensagem[0] === '-' 
                          ?<span className="subtitle expired">Produto vencido</span> 
                          :<span className="subtitle">{notificacao.Not_mensagem}</span>
                          }
                        <span className="date">{formatDate(notificacao.Not_data)}</span>
                      </div>
                    </div>
                  )
                ))}
              </Tab>
              <Tab eventKey="estoque" title={
                <div className="title">
                  <span>Estoque</span>
                  <div className="not-count">{estoqueCount}</div>
                </div>
              }>
                {notificacoesEstoque.map((notificacao) => (
                    <div className="not-item" key={notificacao.Not_id}> 
                      <img src={loteIcon} alt="Lote Icon" />
                      <div className="content">
                        <span> <b>{notificacao.Produto.Prod_nome}</b> atingiu o estoque mínimo</span>
                        <span className="subtitle">{notificacao.Not_mensagem}</span>
                        <span className="date">{formatDate(notificacao.Not_data)}</span>
                      </div>
                    </div>
                ))}
              </Tab>
              <Tab eventKey="validade" title={
                <div className="title">
                  <span>Validade</span>
                  <div className="not-count">{validadeCount}</div>
                </div>
              }>
                {notificacoesValidade.map((notificacao) => (
                  <div className="not-item" key={notificacao.Not_id}> 
                    <TbClockExclamation className="icon-clock"/>
                    <div className="content">
                      <span>Lote <b>{notificacao.Lote?.Lote_cod}</b> de <b>{notificacao.Produto?.Prod_nome}</b> está próximo ao vencimento</span>
                      <span className="subtitle">{notificacao.Not_mensagem}</span>
                      <span className="date">{formatDate(notificacao.Not_data)}</span>
                    </div>
                  </div>
                ))}
              </Tab>
            </Tabs>
          </Offcanvas.Body>
        </Offcanvas>
      
      </div>


    );
}

    
    

export default BarraSuperior;