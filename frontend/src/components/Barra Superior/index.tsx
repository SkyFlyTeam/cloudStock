import React from "react";
import './BarraSuperior.css';
import { TbCircleCaretLeft } from "react-icons/tb";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

const BarraSuperior: React.FC = () => {
    return (
      <div className="BarraSuperior">
        <div className="itensleft">
          <i> <TbCircleCaretLeft /> </i>
          <span>Produtos</span>
        </div>
        <div className="itensright">
          <i> <FaRegBell /> </i>
          <i> <FaRegUser /> </i>
        </div>
      </div>
    );
}

    
    

export default BarraSuperior;