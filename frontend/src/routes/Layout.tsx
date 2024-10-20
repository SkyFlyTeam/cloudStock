import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import BarraSuperior from '../components/Barra Superior';

const Layout = () => {
  return (
    <div className="content">
      <Navbar />
      <BarraSuperior />
      <div className="main-content">
        <Outlet /> 
      </div>
    </div>
  )
}

export default Layout