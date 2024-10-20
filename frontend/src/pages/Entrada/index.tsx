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

function Saidas() {
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
  const [entradasSelecionadas, setEntradasSelecionadas] = useState<Array<{ Prod_cod: number, Lote_quantidade: number, Lote_cod: string, Lote_validade: Date, Usuario_id: number , Fornecedor_id: number, Local_id: number}> | null>([]);

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
    setEntradasSelecionadas((prev) => {
        const newProdutoSelecionado = { 
          Prod_cod: produto.Prod_cod, 
          Lote_quantidade: 0, 
          Lote_cod: '', 
          Lote_validade: new Date(), 
          Usuario_id: Number(user?.Usuario_id), 
          Fornecedor_id: 0,
          Local_id: 0 
        };
        return prev ? [...prev, newProdutoSelecionado] : [newProdutoSelecionado];
      });

    return produto;
  };

  // Atualiza a quantidade selecionada pelo cliente e recalcula o subtotal
  const handleQuantidadeChange = (Prod_cod: number, quantidade: number) => {
    setEntradasSelecionadas((prev) => 
      prev?.map((entrada) => 
        entrada.Prod_cod === Prod_cod 
          ? { ...entrada, Lote_quantidade: quantidade > 0 ? quantidade : 1 } 
          : entrada
      ) || []
    );
  };

  const handleFornecedorChange = (Prod_cod: number, Fornecedor_id: number) => {
    setEntradasSelecionadas((prev) =>
      prev?.map((entrada) =>
        entrada.Prod_cod === Prod_cod
          ? { ...entrada, Fornecedor_id }
          : entrada
      ) || []
    );
  };
  
  const handleLocalChange = (Prod_cod: number, Local_id: number) => {
    setEntradasSelecionadas((prev) =>
      prev?.map((entrada) =>
        entrada.Prod_cod === Prod_cod
          ? { ...entrada, Local_id }
          : entrada
      ) || []
    );
  };
  
  const handleLoteCodChange = (Prod_cod: number, Lote_cod: string) => {
    setEntradasSelecionadas((prev) =>
      prev?.map((entrada) =>
        entrada.Prod_cod === Prod_cod
          ? { ...entrada, Lote_cod }
          : entrada
      ) || []
    );
  };
  
  const handleLoteValidadeChange = (Prod_cod: number, Lote_validade: string) => {
    setEntradasSelecionadas((prev) =>
      prev?.map((entrada) =>
        entrada.Prod_cod === Prod_cod
          ? { ...entrada, Lote_validade: new Date(Lote_validade) }
          : entrada
      ) || []
    );
  };
  
  const calcularSubtotal = (produto: Produto, quantidade: number) => {
    const custo = produto.Prod_custo || 0; // Make sure this value is correct
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
  

  const handleRemoveProduct = (index: number) => {
    setProdutos((prev) => prev.filter((_, i) => i !== index));
    setEntradasSelecionadas((prev) => prev ? prev.filter((_, i) => i !== index) : []);
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
        {produtos.map((produto, index) => {
            const quantidadeSelecionada = entradasSelecionadas?.find((p) => p.Prod_cod === produto.Prod_cod)?.Lote_quantidade || 0;
            const loteCodSelecionado = entradasSelecionadas?.find((p) => p.Prod_cod === produto.Prod_cod)?.Lote_cod || '';
            const loteValidadeSelecionada = entradasSelecionadas?.find((p) => p.Prod_cod === produto.Prod_cod)?.Lote_validade?.toISOString().substr(0, 10) || ''; // Format date to YYYY-MM-DD
            const fornecedorSelecionado = entradasSelecionadas?.find((p) => p.Prod_cod === produto.Prod_cod)?.Fornecedor_id || 0;
            const localSelecionado = entradasSelecionadas?.find((p) => p.Prod_cod === produto.Prod_cod)?.Local_id || 0;

            return (
                <div className="card-entrada-item" key={produto.Prod_cod}>
                <div>
                    <div className="card-name">
                    <span>{produto.Prod_nome} {produto.Prod_marca} {produto.Prod_modelo}</span>
                    </div>
                </div>
                <div className="entrada-options">
                    <div className="quantidade">
                    <Input
                        max={produto.Prod_quantidade}
                        label="Quantidade"
                        type="number"
                        value={quantidadeSelecionada}
                        onChange={(e) => handleQuantidadeChange(produto.Prod_cod, +e.target.value)}
                    />
                    </div>
                    <div className="custo">
                    <span className="label">Custo</span>
                    <span className="value">R${produto.Prod_custo}</span>
                    </div>
                    <div>
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
                    <div className="entrada-lote">
                    <Input 
                        label="Lote"
                        type="text"
                        value={loteCodSelecionado}
                        onChange={(e) => handleLoteCodChange(produto.Prod_cod, e.target.value)}
                    />
                    </div>
                    <div className="entrada-validade">
                    <Input 
                        label="Validade"
                        type="date"
                        value={loteValidadeSelecionada}
                        onChange={(e) => handleLoteValidadeChange(produto.Prod_cod, e.target.value)}
                    />
                    </div>
                    <div>
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
                    <div className="subtotal">
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
      </div>

      <div className="total-container">
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
      label="Cadastrar Saída?" 
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

export default Saidas;