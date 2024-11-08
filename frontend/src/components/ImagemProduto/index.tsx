import React from "react"
import { hostname } from "../../config/apiConfig";

interface Props {
    prod_cod: number
  }

const ImagemProduto: React.FC<Props> = ({ prod_cod }) => {
    return (
        <img
          src={`${hostname}produto/DownloadImage/${prod_cod}`}
          alt="Produto"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/hYHgC6Z/sem-jpg.gif';
        }}
        />
    )
}

export default ImagemProduto