import React from "react";
import './Navbar.css';
import { IoMdPricetags } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <div className="sidebar">
          <div className="logo">
            <div className="textlogo"> <span>CLOUD STOCK</span> </div>
          </div>
    
          <div className="sidebar-menu">
            <div className="logoimg">
                <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt=''></img>
            </div>
            <div className="itens_menu">
              <Link to="/">
                <div className="menu-item active">
                    <BsBoxSeamFill />
                    <div className="navbartext" style={{color: 'white'}}><span>Produtos</span></div>
                </div>
              </Link>
              <div className="menu-item">
                  <IoMdPricetags />
                <div className="navbartext"><span>Categorias</span></div>
              </div>
              <Link to="/Fornecedores">
                <div className="menu-item">
                    <FaUserGroup />
                    <div className="navbartext"><span>Fornecedores</span></div>
                </div>
              </Link>
              <Link to="/LocalArmazenamento">
                <div className="menu-item">
                    <FaWarehouse />
                    <div className="navbartext"><span>Locais Armazenamento</span></div>
                </div>
              </Link>
              <div className="menu-item">
                  <FaSquareArrowUpRight />
                  <div className="navbartext"><span>Saída</span></div>
              </div>
            </div>
          </div>
    
          <div className="logout">
            <div className="logouttext"> <span>Logout</span> </div>
            <PiSignOutBold />
          </div>
        </div>
      );
}
    
    

export default Navbar;