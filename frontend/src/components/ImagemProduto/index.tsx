import React from "react"

interface Props {
    prod_cod: number
  }

const ImagemProduto: React.FC<Props> = ({ prod_cod }) => {
    return (
        <img
          src={`http://localhost:5000/produto/DownloadImage/${prod_cod}`}
          alt="Produto"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ibb.co/hYHgC6Z/sem-jpg.gif';
        }}
        />
    )
}

export default ImagemProduto