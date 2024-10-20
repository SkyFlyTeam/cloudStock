import { useState, useEffect } from "react";
import { Produto, produtoServices } from "../../services/produtoServices";
import { ApiException } from "../../config/apiException";
import './style.css'

/* Componentes */
import BtnAzul from "../../components/BtnAzul";
import Input from "../../components/Input";

/* Icons */
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { Api, hostname} from "../../config/apiConfig";
import Modal from "../../components/Modal";
import BtnCancelar from "../../components/BtnCancelar";
import { useAuth } from "../../context/AuthProvider";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { Local_Armazenamento, localServices } from "../../services/localServices";


function Entradas() {
  // Usuário logado
  const user = useAuth().currentUser

  // Controlar estados dos Modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false); // concluir saida
  const [openModalQuantidade, setOpenModalQuantidade] = useState(false); // verificar quantidade
  const [openModalNulo, setOpenModalNulo] = useState(false); // garantir envio maior que 0

  // data - armazena todos produtos
  const [data, setData] = useState<Produto[]>([]);

  const [locais, setLocais] = useState<Local_Armazenamento[]>([])

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])


  // entradasSelecionadas - {id: id, quantidade: quantidade} - produtos que serão enviados ao back
  const [entradasSelecionadas, setEntradasSelecionadas] = useState<Array<{ 
    id: number, 
    Prod_cod: number, 
    Lote_quantidade: number, 
    Lote_cod: string, 
    Lote_validade: Date, 
    Usuario_id: number, 
    Fornecedor_id: number, 
    LocAr_id: number 
  }>>([]);

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

  const fetchLocal = async () => {
    const result = await localServices.getAllLocais()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setLocais(result)
    }
  }

  const fetchFornecedor = async () => {
    const result = await fornecedorServices.getAllFornecedores()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setFornecedores(result)
    }
  }

  useEffect(() => {
    fetchProdutos();
    fetchLocal()
    fetchFornecedor()
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

    // Atualiza o estado de entradasSelecionadas
    setEntradasSelecionadas((prev) => [
      ...prev,
      {
        id: Date.now(), // ou use outro método para gerar um id único
        Prod_cod: produto.Prod_cod,
        Lote_quantidade: 0,
        Lote_cod: '',
        Lote_validade: new Date(),
        Usuario_id: user?.Usuario_id || 0,
        Fornecedor_id: 0,
        LocAr_id: 0
      }
    ]);

    return produto;
  };

  // Atualiza a quantidade selecionada pelo cliente e recalcula o subtotal
  const handleQuantidadeChange = (id: number, quantidade: number) => {
    setEntradasSelecionadas((prev) => 
      prev.map((entrada) => 
        entrada.id === id 
          ? { ...entrada, Lote_quantidade: quantidade > 0 ? quantidade : 1 } 
          : entrada
      )
    );
  };

  const handleFornecedorChange = (id: number, Fornecedor_id: number) => {
    setEntradasSelecionadas((prev) => 
      prev.map((entrada) => 
        entrada.id === id 
          ? { ...entrada, Fornecedor_id }
          : entrada
      )
    );
  };
  
  const handleLocalChange = (id: number, LocAr_id: number) => {
    setEntradasSelecionadas((prev) => 
      prev.map((entrada) => 
        entrada.id === id 
          ? { ...entrada, LocAr_id }
          : entrada
      )
    );
  };
  
  const handleLoteCodChange = (id: number, Lote_cod: string) => {
    setEntradasSelecionadas((prev) => 
      prev.map((entrada) => 
        entrada.id === id 
          ? { ...entrada, Lote_cod }
          : entrada
      )
    );
  };
  
  const handleLoteValidadeChange = (id: number, Lote_validade: string) => {
    setEntradasSelecionadas((prev) => 
      prev.map((entrada) => 
        entrada.id === id 
          ? { ...entrada, Lote_validade: new Date(Lote_validade) }
          : entrada
      )
    );
  };
  
  const calcularSubtotal = (produto: Produto, quantidade: number) => {
    const custo = produto.Prod_custo || 0; 
    const qtd = quantidade || 0;
    return (custo * qtd).toFixed(2);
  };

  const calcularTotal = () => {
    const total = produtos.reduce((acc, produto) => { 
        const quantidadeSelecionada = entradasSelecionadas?.find( 
          (p) => p.Prod_cod=== produto.Prod_cod
        )?.Lote_quantidade || 0;
        const custo = produto.Prod_custo || 0; 
        return acc + custo * quantidadeSelecionada; 
      }, 0)
      .toFixed(2);
    return total;
  };
  


  const handleRemoveProduct = (id: number) => {
    setProdutos((prev) => prev.filter((produto) => produto.Prod_cod !== id));
    setEntradasSelecionadas((prev) => prev.filter((entrada) => entrada.id !== id));
  };

  const concluir = () => {
    if (entradasSelecionadas?.find((produto) => produto.Lote_quantidade <= 0)) {
      setOpenModalNulo(true)
      return; 
    }
    setOpenModalCadastro(true)
  }

  const handleConcluir = async () => {
    try {
      console.log('Payload to API:', entradasSelecionadas); // Log the payload
  
      const response = await Api().post<any>('/entrada', entradasSelecionadas, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Resposta da API:', response);
  
      // Clear the state after the request
      setEntradasSelecionadas([]);
      setProdutos([]);
      fetchProdutos();
      setOpenModalCadastro(false);
    } catch (error: any) {
      console.error('Erro na função handleConcluir:', error);
    }
  }
    
  return (
    <main>
    <div className="page-title">
      <h1 className="title">Entradas</h1>
      <hr className="line" />
    </div>

    <div className="entradas-container">
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

        {produtos.length <= 0 && (
          <div className="emptyProducts">
            <img src="https://i.ibb.co/MVgn94H/Imagem-09-08-58-4d6e6647.jpg" alt="" />
            <p>Adicione um produto para continuar</p>
          </div>
        )}
        
        {entradasSelecionadas.map((entrada, index) => {
          const produto = produtos.find((p) => p.Prod_cod === entrada.Prod_cod);

          if (!produto) return null;
        
            return (
           
             <div className="card-item" key={produto.Prod_cod}>
              {/* Nome do produto em negrito e em uma linha separada */}
              <span className="nome-produto">{produto.Prod_nome}</span>

            
              {/* Demais labels e inputs */}
              <div className="entrada-options">
                  <Input
                    max={produto.Prod_quantidade}
                    label="Quantidade"
                    type="number"
                    className="quantidade-container"
                    value={quantidadeSelecionada}
                    onChange={(e) => handleQuantidadeChange(produto.Prod_cod, +e.target.value)}
                  />

                  <div className="custo-entrada">
                    <span className="label">Custo</span>
                    <span className="value">R${produto.Prod_custo}</span>
                  </div>
                  <div className="fornecedor-container">
                    <label htmlFor="inFornecedor">Fornecedor</label>
                    <select 
                      id="inFornecedor"
                      className="form-select-custom"
                      value={fornecedorSelecionado}
                      onChange={(e) => handleFornecedorChange(produto.Prod_cod, +e.target.value)}
                    >
                      <option value="" selected>Buscar...</option>
                      {fornecedores.map((f) => (
                        <option key={f.Forn_id} value={f.Forn_id}>
                          {f.Forn_razaoSocial}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input 
                    label="Lote"
                    type="text"
                    className="lote-container"
                    value={loteCodSelecionado}
                    onChange={(e) => handleLoteCodChange(produto.Prod_cod, e.target.value)}
                  />

                    <Input 
                      label="Validade"
                      type="date"
                      className="entrada-validade"
                      value={loteValidadeSelecionada}
                      onChange={(e) => handleLoteValidadeChange(produto.Prod_cod, e.target.value)}
                    />
                  <div className="local-container">
                      <label htmlFor="inLocal">Local Armazenamento</label>
                      <select 
                        id="inLocal"
                        className="form-select-custom"
                        value={localSelecionado}
                        onChange={(e) => handleLocalChange(produto.Prod_cod, +e.target.value)}
                      >
                        <option value="" selected>Buscar...</option>
                        {locais.map((d) => (
                          <option key={d.LocAr_id} value={d.LocAr_id}>
                            {d.LocAr_nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="subtotal-entrada">
                      <span className="label">Subtotal</span>
                      <span className="value">R${calcularSubtotal(produto, quantidadeSelecionada)}</span>
                    </div>
                    <AiOutlineDelete
                      size={24}
                      className="delete-icon"
                      onClick={() => handleRemoveProduct(index)}
                    />
              </div>
            </div>
            );
        })}

      <div className="total-container-entrada">
        <span>Total: R${calcularTotal()}</span>
      </div>

      {produtos.length > 0 && (
        <div className="btn-concluir">
          <BtnAzul icon={<IoAddCircleOutline />} label="CONCLUIR" onClick={concluir} />
        </div>
      )}
    </div>

    {/* MODALS */}
    <Modal
      isOpen={openModalCadastro} 
      label="Cadastrar Entrada?" 
      buttons={
        <div className="confirma-buttons">
          <BtnCancelar onClick={() => setOpenModalCadastro(false)} /> 
          <BtnAzul
            icon={<IoAddCircleOutline />}
            label="CADASTRAR"
            onClick={handleConcluir} 
          />
        </div>
      }
      children={undefined}
    />

    <Modal
      isOpen={openModalNulo} 
      label="Quantidade deve ser maior que 0"
      buttons={
        <div className="single-button">
          <BtnCancelar onClick={() => setOpenModalNulo(false)} /> 
        </div>
      }
      children={undefined}
    />
  </main>

  
  );
}

export default Entradas;
