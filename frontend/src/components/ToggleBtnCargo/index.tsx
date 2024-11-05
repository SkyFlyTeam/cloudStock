import axios from 'axios';
import React from 'react';
import './style.css'

interface Props {
  checked: boolean;
  cod: number; // Adiciona prod_cod como prop
  onStatusChange: (newStatus: boolean) => void; // Adiciona o callback
  rota?: string //nome da rota 
}

const ToggleBtnCargo: React.FC<Props> = ({ checked, cod, onStatusChange, rota }) => {
  const toggleStatus = async () => {
    try {
      const updatedStatus = !checked; // Inverte o estado
      await axios.put(`${rota}/cargo/${cod}`, { status: updatedStatus });
      onStatusChange(updatedStatus); // Chama o callback com o novo status
      window.location.reload()
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error);
    }
  }
  
  return (
    <label className="switch">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={toggleStatus} 
      />
      <span className="slider round"></span>
    </label>
  );
};

export default ToggleBtnCargo;