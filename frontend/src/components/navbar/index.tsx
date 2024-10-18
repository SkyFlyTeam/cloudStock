import React from "react";
import './Navbar.css';
import { IoMdPricetags } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { PiRowsPlusTopFill, PiSignOutBold } from "react-icons/pi";
import { Link, useLocation} from "react-router-dom";
import { MdAllInbox, MdOutlineAppRegistration } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { HiMiniUsers } from "react-icons/hi2";
import { useAuth } from "../../context/AuthProvider";

const Navbar: React.FC = () => {
  const location = useLocation(); // Hook para pegar a rota atual
  const { handleLogout, currentUser } = useAuth();
  
  return (
    <div className="sidebar">
      <div className="logo">
        <div className="textlogo"> <span>CLOUD STOCK</span> </div>
      </div>

      <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt='' />

      <div className="sidebar-menu">
        <div className="itens_menu">
          {/* Conteúdo baseado no Cargo_id */}
          {currentUser?.Cargo_id === 1 && (
            <>
              {/* Links e Menus */}
              <Link to="/Produtos" className="link">
                <div className={location.pathname === '/Produtos' ? 'menu-item active' : 'menu-item'}>
                  <BsBoxSeamFill />
                  <div className="navbartext"><span>Produtos</span></div>
                </div>
              </Link>

              <Link to="/Saidas" className="link">
                <div className={location.pathname === '/Saidas' ? 'menu-item active' : 'menu-item'}>
                  <FaSquareArrowUpRight />
                  <div className="navbartext"><span>Saídas</span></div>
                </div>
              </Link>
              {/* Outros Links... */}
            </>
          )}

          {/* Outras verificações baseadas em Cargo_id */}
        </div>
      </div>

      {/* Logout */}
      <div className="logout" onClick={handleLogout}>
        <span>Logout</span> 
        <PiSignOutBold />
      </div>
    </div>
  );
};

export default Navbar;

    
