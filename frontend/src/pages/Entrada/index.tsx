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
import { Api, hostname } from "../../config/apiConfig";
import Modal from "../../components/Modal";
import BtnCancelar from "../../components/BtnCancelar";
import { useAuth } from "../../context/AuthProvider";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { Local_Armazenamento, localServices } from "../../services/localServices";
import { useNavigate } from "react-router-dom";
import { noop } from "@tanstack/react-table";
import { Entrada } from "../../services/entradaServices";


function Entradas() {
  // Usuário logado
  const user = useAuth().currentUser
  const navigate = useNavigate()

  // Novo estado para o valor do select
  const [selectedProduto, setSelectedProduto] = useState("");

  // Controlar estados dos Modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false); // concluir saida
  const [openModalQuantidade, setOpenModalQuantidade] = useState(false); // verificar quantidade
  const [openModalNulo, setOpenModalNulo] = useState(false); // garantir envio maior que 0
  const [openModalFornecedor, setOpenModalFornecedor] = useState(false) // verifica fornecedor
  const [openModalLote, setOpenModalLote] = useState(false) // verifica lote
  const [openModalLocalArmazenamento, setOpenModalLocalArmazenamento] = useState(false) // verifica local de armazenamento
  const [openModalValidade, setOpenModalValidade] = useState(false)

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);

  // data - armazena todos produtos
  const [data, setData] = useState<Produto[]>([]);

  const [locais, setLocais] = useState<Local_Armazenamento[]>([])

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])


  // entradasSelecionadas - {id: id, quantidade: quantidade} - produtos que serão enviados ao back
  const [entradasSelecionadas, setEntradasSelecionadas] = useState<Array<{
    id: string,
    Prod_cod: number,
    Lote_quantidade: number,
    Lote_cod: string,
    Lote_validade: any,
    Usuario_id: number,
    Forn_id: number,
    LocAr_id: number,
    Prod_custo: number,
    Lote_unico: boolean // Atributo local, Flag para Input da Validade
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
      setFornecedores(result.filter((f) => f.Forn_status != false));
    }
  }

  useEffect(() => {
    fetchProdutos();
    fetchLocal()
    fetchFornecedor()
  }, []);

  useEffect(() => {
    setFilteredProdutos(
      data.filter(produto =>
        produto.Prod_status ? produto.Prod_nome.toLowerCase().includes(searchTerm.toLowerCase()) : noop()
      )
    );
  }, [searchTerm, data]);

  const getProduto = async (id: number): Promise<Produto | undefined> => {
    const produto = data.find((p: Produto) => p.Prod_cod === id);

    if (!produto) {
      return undefined;
    }

    setProdutos((prev) => {
      const produtoJaAdicionado = prev?.some((p) => p.Prod_cod === produto.Prod_cod);
      return prev ? [...prev, produto] : [produto];
    });

    setEntradasSelecionadas((prev) => {
      const newEntrada = {
        id: `${produto.Prod_cod}-${Date.now()}`, // Make sure the ID is a string
        Prod_cod: produto.Prod_cod,
        Lote_quantidade: 0,
        Lote_cod: '',
        Lote_validade: null,
        Usuario_id: user?.Usuario_id || 0,
        Forn_id: 0,
        LocAr_id: 0,
        Prod_custo: 0,
        Lote_unico: true
      };
      return prev ? [...prev, newEntrada] : [newEntrada];
    });

    // Limpa o valor selecionado do select após a seleção
    setSelectedProduto("");

    return produto;
  };

  // Atualiza a quantidade selecionada pelo cliente e recalcula o subtotal
  const handleQuantidadeChange = (id: string, quantidade: number) => {
    setEntradasSelecionadas((prev) =>
      prev.map((entrada) =>
        entrada.id === id
          ? { ...entrada, Lote_quantidade: quantidade }
          : entrada
      )
    )
  };

  const handleFornecedorChange = (id: string, Forn_id: number) => {
    setEntradasSelecionadas((prev) =>
      prev.map((entrada) =>
        entrada.id === id
          ? { ...entrada, Forn_id } // Propriedade correta
          : entrada
      )
    );
  };

  const handleLocalChange = (id: string, LocAr_id: number) => {
    setEntradasSelecionadas((prev) =>
      prev.map((entrada) =>
        entrada.id === id
          ? { ...entrada, LocAr_id }
          : entrada
      )
    );
  };

  const handleLoteCodChange = (produto: Produto, Prod_cod: number, Prod_validade: boolean, id: string, Lote_cod: string) => {
    if (Prod_validade) {  // Verifica se produto na entrada tem validade para continuar com pesquisa
      let validade = '';  // Chave 'validade'
      produto.Lotes.find((p) => {
        if (p.Lote_cod == Lote_cod && p.Prod_cod == Prod_cod) { // Procura pelo Lote atrelado ao Produto
          validade = p.Lote_validade.toString();

          setEntradasSelecionadas((prev) =>
            prev.map((entrada) =>
              entrada.id === id
                ? { ...entrada, Lote_cod, Lote_validade: validade, Lote_unico: false }
                : entrada
            ));
        }
      });

      if (validade == '') { // Se não houver manipulação de 'validade', Lote é considerado único/permite usuário adicionar validade
        setEntradasSelecionadas((prev) =>
          prev.map((entrada) =>
            entrada.id === id
              ? { ...entrada, Lote_cod, Lote_unico: true }
              : entrada
          ));
      }
    }
    else setEntradasSelecionadas((prev) =>
      prev.map((entrada) =>
        entrada.id === id
          ? { ...entrada, Lote_cod }
          : entrada
      ));

  };

  const handleLoteValidadeChange = (id: string, Lote_validade: string) => {
    // Adiciona 'T00:00:00' para garantir que a data seja tratada como local
    if (Lote_validade == '')
      return 0;
    const date = new Date(Lote_validade + 'T00:00:00');

    setEntradasSelecionadas((prev) =>
      prev.map((entrada) =>
        entrada.id === id
          ? { ...entrada, Lote_validade: date }
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
    const total = entradasSelecionadas.reduce((acc, entrada) => {
      const produto = produtos.find((p) => p.Prod_cod === entrada.Prod_cod)
      const custo = produto ? produto.Prod_custo : 0
      return acc + (custo * entrada.Lote_quantidade)
    }, 0).toFixed(2)
    return total
  };

  const handleRemoveProduct = (id: string) => {
    setEntradasSelecionadas((prevEntradas) => {
      const updatedEntradas = prevEntradas.filter((entrada) => entrada.id !== id);

      const updatedProdutos = produtos.filter((produto) =>
        updatedEntradas.some((entrada) => entrada.Prod_cod === produto.Prod_cod)
      );

      setProdutos(updatedProdutos);
      return updatedEntradas;
    });
  };

  const concluir = () => {
    if (entradasSelecionadas?.find((produto) => produto.Lote_quantidade <= 0)) {
      setOpenModalNulo(true)
      return
    }
    if (entradasSelecionadas?.find((produto) => produto.Forn_id === 0)) {
      setOpenModalFornecedor(true)
      return
    }
    if (entradasSelecionadas?.find((produto) => produto.Lote_cod === '')) {
      setOpenModalLote(true)
      return
    }
    for (const entrada of entradasSelecionadas) {
      const prod = produtos.find((p) => p.Prod_cod === entrada.Prod_cod)
      if (prod?.Prod_validade == true && (entrada.Lote_validade === null || entrada.Lote_validade === '')) {
        setOpenModalValidade(true)
        return
      }
    }
    if (entradasSelecionadas?.find((produto) => produto.LocAr_id === 0)) {
      setOpenModalLocalArmazenamento(true)
      return
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
      navigate('/RegistrosEntrada')
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
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="suggestions-container">
                {filteredProdutos.map((produto) => (
                  <div
                    key={produto.Prod_cod}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchTerm("");
                      getProduto(produto.Prod_cod);
                    }}
                  >
                    {produto.Prod_nome} {produto.Prod_marca} {produto.Prod_modelo}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {entradasSelecionadas.length <= 0 && (
          <div className="emptyProducts">
            <img src="https://i.ibb.co/MVgn94H/Imagem-09-08-58-4d6e6647.jpg" alt="" />
            <p>Adicione um produto para continuar</p>
          </div>
        )}

        {entradasSelecionadas.map((entrada, index) => {
          const produto = produtos.find((p) => p.Prod_cod === entrada.Prod_cod);

          if (!produto) return null;

          return (
            <div className="card-item" key={entrada.id}>
              {/* Nome do produto em negrito e em uma linha separada */}
              <span className="nome-produto">{produto.Prod_nome}</span>

              <div className="entrada-card">
                {/* Demais labels e inputs */}
                <div className="entrada-options">
                  <Input
                    min="0"
                    label="Quantidade"
                    type="number"
                    className="quantidade-container"
                    value={entrada.Lote_quantidade}
                    onChange={(e) => handleQuantidadeChange(entrada.id, +e.target.value)}
                  />

                  <div className="custo-entrada">
                    <span className="label">Custo</span>
                    <span className="value">R$ {Number(produto.Prod_custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="fornecedor-container">
                    <label htmlFor="inFornecedor">Fornecedor</label>
                    <select
                      id="inFornecedor"
                      className="form-select-custom"
                      onChange={(e) => handleFornecedorChange(entrada.id, +e.target.value)}
                    >
                      <option value="" selected disabled>Buscar...</option>
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
                    className="lote-container-entrada"
                    value={entrada.Lote_cod}
                    onChange={(e) => handleLoteCodChange(produto, entrada.Prod_cod, produto.Prod_validade, entrada.id, e.target.value)}
                  />

                  <Input
                    label="Validade"
                    type="date"
                    className="entrada-validade"
                    max="9999-12-31"
                    value={entrada.Lote_unico ? noop() : entrada.Lote_validade}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleLoteValidadeChange(entrada.id, e.target.value)}
                    disabled={produto.Prod_validade && entrada.Lote_unico ? false : true}
                  />


                  <div className="local-container">
                    <label htmlFor="inLocal">Local Armazenamento</label>
                    <select
                      id="inLocal"
                      className="form-select-custom"
                      value={entrada.LocAr_id}
                      onChange={(e) => handleLocalChange(entrada.id, +e.target.value)}
                    >
                      <option value="" selected>Buscar...</option>
                      {locais.map((d) => (
                        <option key={d.LocAr_id} value={d.LocAr_id}>
                          {d.LocAr_nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="subtotal-entrada">
                  <span className="label">Subtotal</span>
                  <span className="value">R$ {Number(calcularSubtotal(produto, entrada.Lote_quantidade)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <AiOutlineDelete
                size={24}
                className="delete-icon"
                onClick={() => handleRemoveProduct(entrada.id)}
              />
              <span className="quantidade-produto">Quantidade disponível: {produto.Prod_quantidade}</span>
            </div>
          );
        })}

        <div className="total-container-entrada">
          <span>Total: R$ {Number(calcularTotal()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>

        {entradasSelecionadas.length > 0 && (
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

      <Modal
        isOpen={openModalFornecedor}
        label="Selecione um fornecedor"
        buttons={
          <div className="single-button">
            <BtnCancelar onClick={() => setOpenModalFornecedor(false)} />
          </div>
        }
        children={undefined}
      />

      <Modal
        isOpen={openModalLote}
        label="Adicione um lote"
        buttons={
          <div className="single-button">
            <BtnCancelar onClick={() => setOpenModalLote(false)} />
          </div>
        }
        children={undefined}
      />

      <Modal
        isOpen={openModalLocalArmazenamento}
        label="Selecione um local de armazenamento"
        buttons={
          <div className="single-button">
            <BtnCancelar onClick={() => setOpenModalLocalArmazenamento(false)} />
          </div>
        }
        children={undefined}
      />

      <Modal
        isOpen={openModalValidade}
        label="Coloque uma data de validade válida"
        buttons={
          <div className="single-button">
            <BtnCancelar onClick={() => setOpenModalValidade(false)} />
          </div>
        }
        children={undefined}
      />
    </main>


  );
}

export default Entradas;
