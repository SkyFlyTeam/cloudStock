import axios from 'axios';
import React from 'react';
import './style.css'

interface Props {
  checked: boolean;
  cod: number; // Adiciona prod_cod como prop
  onStatusChange: (newStatus: boolean) => void; // Adiciona o callback
  rota?: string //nome da rota 
  usuario_id?: number
}

const ToggleBtn: React.FC<Props> = ({ checked, cod, onStatusChange, rota, usuario_id }) => {
  const toggleStatus = async () => {
    try {
      const updatedStatus = !checked; // Inverte o estado
      await axios.put(`${rota}/status/${cod}`, { status: updatedStatus }, { headers: { usuario_id: usuario_id } });
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

export default ToggleBtn;