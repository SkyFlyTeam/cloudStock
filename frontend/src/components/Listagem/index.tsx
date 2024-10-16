import React from 'react';
import './style.css';

interface Column {
  header: string;
  key: string;
}

interface Item {
  [key: string]: string;
}

interface ListagemProps {
  data: Item[];
  columns: Column[];
}

const Listagem: React.FC<ListagemProps> = ({ data, columns }) => {
  return (
    <div className="listagem-container">
      <div className="listagem-header">
        {columns.map((column) => (
          <span key={column.key}>{column.header}</span>
        ))}
      </div>
      {data.map((item, index) => (
        <div
          key={index}
          className={`listagem-item ${index % 2 === 0 ? 'even' : 'odd'} ${
            index === 0 ? 'first-item' : index === data.length - 1 ? 'last-item' : ''
          }`}
        >
          {columns.map((column) => (
            <span
              key={column.key}
              className={column.key === 'valorTotal' ? 'valor-total' : ''}
            >
              {item[column.key]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Listagem;
