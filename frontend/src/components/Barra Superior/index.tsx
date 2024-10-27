import React from "react";
import './BarraSuperior.css';
import { TbCircleCaretLeft } from "react-icons/tb";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";


const BarraSuperior: React.FC = () => {
  const location = useLocation() // Hook para pegar a rota atual
  const navigate = useNavigate() // Funções para navegar

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
            <TbCircleCaretLeft size={25} opacity={0.9} color="#ffffff" className="link-icon"/>
          </Link>
          <span>{location.pathname.replace('/', '')}</span>
        </div>
        <div className="itensright">
          <i> <FaRegBell /> </i>
          <i> <FaRegUser /> </i>
        </div>
      </div>
    );
}

    
    

export default BarraSuperior;