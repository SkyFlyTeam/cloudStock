import axios from 'axios';
import React from 'react';

interface Props {
  checked: boolean;
  cod: number; // Adiciona prod_cod como prop
  onStatusChange: (newStatus: boolean) => void; // Adiciona o callback
}

const ToggleBtn: React.FC<Props> = ({ checked, cod, onStatusChange }) => {
  const toggleStatus = async () => {
    try {
      const updatedStatus = !checked; // Inverte o estado
      await axios.put(`/produto/${cod}`, { prod_status: updatedStatus });
      onStatusChange(updatedStatus); // Chama o callback com o novo status
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