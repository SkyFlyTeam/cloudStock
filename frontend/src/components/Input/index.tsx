import React from 'react';
import './style.css';

interface InputProps {
  label: string; // Rótulo do input
  min?: number | string;
  max?: number | string;
  className?: string; // Recebe classes para 'div' base
  placeholder?: string; // Texto que aparece quando o input está vazio
  type?: string; // Tipo do input, por padrão é "text"
  value?: string | number ; // Valor do input (ajustado para string ou number)
  options?: { label: string, value: any }[]; // Agora é uma lista de objetos { label, value }
  accept?: string; // Usado para seleção de arquivo
  disabled?: boolean; // Atributo para desabilitar input, padrão 'false' para deixar habilitado
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Função de callback para lidar com mudanças
}

const Input: React.FC<InputProps> = ({
  label,
  min,
  max,
  className,
  placeholder,
  type = "text",
  value,
  options,
  accept = "",
  disabled = false,
  onChange
}) => {
  return (
    <div className={className}>
      {disabled === true ? (
        <label className="input-label-disabled">{label}</label>
      ) : (
        <label>{label}</label>
      )}

      {/* Condição que verifica se o tipo do input é "select" */}
      {type === "select" ? (
        <select className="input-field" value={value} onChange={onChange} disabled={disabled}>
          <option value="">{placeholder || "Selecione..."}</option>
          {options && options.map((option, index) => (
            <option key={index} value={option.value}> {/* Usando option.value */}
              {option.label} {/* Exibindo option.label */}
            </option>
          ))}
        </select>
      ) : (
        <input
          min={min}
          max={max}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="input-field"
          accept={accept}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Input;
