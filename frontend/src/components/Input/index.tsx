import React from 'react'; 
import './style.css'; 

interface InputProps {
  label: string; // Rótulo do input
  className?: string; // Recebe classes para 'div' base
  placeholder?: string; // Texto que aparece quando o input está vazio
  type?: string; // Tipo do input, por padrão é "text"
  value?: string; // Valor do input
  options?: string[]; // Nova prop para as opções do select, se for o caso
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Função de callback para lidar com mudanças
}


const Input: React.FC<InputProps> = ({ label, className, placeholder, type = "text", value, options, onChange }) => {
  return (
    <div className={className}>

      <label>{label}</label> 
      
      {/* Condição que verifica se o tipo do input é "select" */}
      {type === "select" ? (
        <select className="input-field" value={value} onChange={onChange}> {/* Se for "select", renderiza um select */}
          <option value="">{placeholder || "Selecione..."}</option> 
          {options && options.map((option, index) => ( // Se existem opções, mapeia cada uma para criar uma option
            <option key={index} value={option}>{option}</option> // Cada opção recebe um valor e exibe o texto correspondente
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder} 
          value={value}
          onChange={onChange} 
          className="input-field"
        />
      )}
    </div>
  );
};

export default Input; 
