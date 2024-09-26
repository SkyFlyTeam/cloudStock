import React from "react";
import './produtocard.css';
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductCard: React.FC = () => {
    return (
        <div className="card">
            <div className="card-img">
                <img
                src="https://edifier.com.br/pub/media/catalog/product/f/o/fone-bluetooth-edifier-w600bt-pret_1.jpg"
                alt=""
                />
            </div>
            <div className="card-info">
                Produto
            </div>
            <div className="card-info">
                Categoria
            </div>
            <div className="card-info">
                Quantidade
            </div>
            <div className="card-info">
                Validade
            </div>
            <div className="card-info">
                Preço
            </div>
            <div className="card-actions">
                <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
                </label>
                <FaEdit className="edit-icon" />
                <FaTrash className="delete-icon" />
            </div>
        </div>
      );
}
    
    

export default ProductCard;