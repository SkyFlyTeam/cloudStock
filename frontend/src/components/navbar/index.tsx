import React from "react";
import './Navbar.css';
import { IoMdPricetags } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";

const Navbar: React.FC = () => {
    return (
        <div className="sidebar">
          <div className="logo">
            <span>CLOUD STOCK</span>
          </div>
    
          <div className="sidebar-menu">
            <div className="logoimg">
                <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png"></img>
            </div>
            <div className="menu-item active">
                <BsBoxSeamFill />
              <span> Produtos</span>
            </div>
            <div className="menu-item">
                <IoMdPricetags />
              <span>Categorias</span>
            </div>
            <div className="menu-item">
                <FaUserGroup />
              <span>Fornecedores</span>
            </div>
            <div className="menu-item">
                <FaWarehouse />
                <span>Locais Armazenamento</span>
            </div>
            <div className="menu-item">
                <FaSquareArrowUpRight />
                <span>Saída</span>
            </div>
          </div>
    
          <div className="logout">
            <span>Logout</span>
            <PiSignOutBold />
          </div>
        </div>
      );
}
    
    

export default Navbar;