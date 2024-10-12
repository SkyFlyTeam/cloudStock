import { useState, useEffect } from "react";
import { Produto, produtoServices } from "../../services/produtoServices";
import { ApiException } from "../../config/apiException";
import "./style.css";

/* Componentes */
import BtnAzul from "../../components/BtnAzul";
import Input from "../../components/Input";

/* Icons */
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { Api, hostname } from "../../config/apiConfig";

function Saidas() {
  // data - armazena todos produtos
  const [data, setData] = useState<Produto[]>([]);

  // produtosSelecionados - {id: id, quantidade: quantidade} - produtos que serão enviados ao back
  const [produtosSelecionados, setProdutosSelecionados] = useState<Array<{ id: number, quantidade: number }> | null>([]);

  // produtos - produtos que serão exibidos
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Função para buscar todos os produtos
  const fetchProdutos = async () => {
    const result = await produtoServices.getAllProdutos();
    if (result instanceof ApiException) {
      console.log(result.message);
    } else {
      setData(result);
    }
  };

  // Chama a função para pegar todos os produtos do BD ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []);

  const getProduto = async (id: number): Promise<Produto | undefined> => {
    const produto = data.find(
      (p: Produto) => p.Prod_cod === id
    );

    if (!produto) {
      return undefined;
    }

    // Atualiza o estado de produtos a serem exibidos
    setProdutos((prev) => {
      const newProduto = produto;
      return prev ? [...prev, newProduto] : [newProduto];
    });

    // Atualiza o estado de produtosSelecionados
    setProdutosSelecionados((prev) => {
      const newProdutoSelecionado = { id: produto.Prod_cod, quantidade: 0 };
      return prev ? [...prev, newProdutoSelecionado] : [newProdutoSelecionado];
    });

        return produto;
    };

  // Atualiza a quantidade selecionada pelo cliente e recalcula o subtotal
  const handleQuantidadeChange = (id: number, quantidade: number) => {
    setProdutosSelecionados((prev) =>
      prev?.map((produto) =>
        produto.id === id ? { ...produto, quantidade: quantidade } : produto
      ) || []
    );
    setProdutos([...produtos]);
  };

  const calcularSubtotal = (produto: Produto, quantidade: number) => {
    const custo = produto.Prod_custo || 0; // Make sure this value is correct
    const qtd = quantidade || 0;
    return (custo * qtd).toFixed(2);
  };

  const calcularTotal = () => {
    const total = produtos
      .reduce((acc, produto) => {
        const quantidadeSelecionada = produtosSelecionados?.find(
          (p) => p.id === produto.Prod_cod
        )?.quantidade || 0;
        const custo = produto.Prod_custo || 0; 
        return acc + custo * quantidadeSelecionada;
      }, 0)
      .toFixed(2);
    return total;
  };

  const handleRemoveProduct = (id: number) => {
    setProdutos((prev) => prev.filter((produto) => produto.Prod_cod !== id));
    setProdutosSelecionados((prev) =>
      prev ? prev.filter((produto) => produto.id !== id) : []
    );
  };

  const handleConcluir = async () => {
    try {
      // Chamada da API e aguarda a conclusão
      const response = await Api().post<any>('/saida/teste', produtosSelecionados, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Resposta da API:", response);
      // Limpa os estados
      setProdutosSelecionados([]);
      setProdutos([]);
  
      console.log("Produtos removidos e estados limpos");
    } catch (error: any) {
      console.error("Erro na função handleConcluir:", error);
    }
  }
    
  return (
    <main>
    <div className="page-title">
      <h1 className="title">Saídas</h1>
      <hr className="line" />
    </div>

    <div className="saidas-container">
      <div className="inputContainer">
        <div>Produto</div>
        <div className="inputButton">
          <select 
            className="form-select-custom" 
            aria-label="Default select example" 
            onChange={(e) => getProduto(+e.target.value)}
          >
            <option value="" selected>Buscar...</option>
            {data.map((d) => (
              <option key={d.Prod_cod} value={d.Prod_cod}>
                {d.Prod_nome} {d.Prod_marca} {d.Prod_modelo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cards-group">
        {produtos.length <= 0 && (
          <div className="emptyProducts">
            <img src="https://i.ibb.co/MVgn94H/Imagem-09-08-58-4d6e6647.jpg" alt="" />
            <p>Adicione um produto para continuar</p>
          </div>
        )}
        {produtos.map((produto) => {
          const quantidadeSelecionada =
            produtosSelecionados?.find((p) => p.id === produto.Prod_cod)?.quantidade || 0;
          return (
            <div className="card-item" key={produto.Prod_cod}>
            <div className="card-name">
              <span>
                {produto.Prod_nome} {produto.Prod_marca} {produto.Prod_modelo}
              </span>
            </div>
            <div className="custo-quantidade">
              <div className="custo">
                <span className="label">Custo</span>
                <span className="value">R${produto.Prod_custo}</span>
              </div>
              <div className="quantidade">
                <Input
                  label="Quantidade"
                  type="number"
                  value={quantidadeSelecionada}
                  onChange={(e) =>
                    handleQuantidadeChange(produto.Prod_cod, Number(e.target.value))
                  }
                />
              </div>
              <div className="subtotal">
                <span className="label">Subtotal</span>
                <span className="value">R${calcularSubtotal(produto, quantidadeSelecionada)}</span>
              </div>
            </div>
            <AiOutlineDelete
              size={24}
              className="delete-icon"
              onClick={() => handleRemoveProduct(produto.Prod_cod)}
            />
          </div>
          );
        })}
      </div>

      <div className="total-container">
        <span>Total: R${calcularTotal()}</span>
      </div>

      {produtos.length > 0 && (
        <div className="btn-concluir">
          <BtnAzul icon={<IoAddCircleOutline />} label="CONCLUIR" onClick={handleConcluir} />
        </div>
      )}
    </div>
  </main>
  );
}

export default Saidas;