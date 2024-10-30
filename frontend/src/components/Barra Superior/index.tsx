import React, { useState } from "react";
import './BarraSuperior.css';
import { TbCircleCaretLeft } from "react-icons/tb";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Offcanvas from 'react-bootstrap/Offcanvas';
import { Tab, Tabs } from "react-bootstrap";


const BarraSuperior: React.FC = () => {
  const location = useLocation() // Hook para pegar a rota atual
  const navigate = useNavigate() // Funções para navegar

  // State/Funções do OffCanvas de Notificações
  const [showNotifications, setShowNotifications] = useState(false)

  const handleCloseNotifications = () => setShowNotifications(false)
  const handleShowNotifications = () => setShowNotifications(true)

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
          <i> <FaRegBell onClick={handleShowNotifications}/> </i>
          <i> <FaRegUser /> </i>
        </div>

        <Offcanvas show={showNotifications} onHide={handleCloseNotifications} placement='end'>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Notificações</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Tabs
              defaultActiveKey="todas"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="todas" title="Todas">
                Tab content for Home
              </Tab>
              <Tab eventKey="estoque" title="Estoque">
                Tab content for Profile
              </Tab>
              <Tab eventKey="validade" title="Validade">
                Tab content for Contact
              </Tab>
            </Tabs>
          </Offcanvas.Body>
        </Offcanvas>
      
      </div>


    );
}

    
    

export default BarraSuperior;