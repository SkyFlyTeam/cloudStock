import React, { useState, useEffect } from "react";
import { ApiException } from "../../config/apiException";
import { Registro, registrosServices } from "../../services/registrosServices";
import { FaRegArrowAltCircleRight } from "react-icons/fa"; // Importando o ícone Operações
import { PiInfo } from "react-icons/pi"; // Importando o ícone Sistema
import './style.css';
import SearchBar from "../../components/SearchBar/SearchBar"
import { BsFilter, BsLink45Deg, BsBoxSeamFill } from "react-icons/bs";
import { Entrada, entradaServices } from "../../services/entradaServices";
import { Saida, saidaServices } from "../../services/saidaServices";
import Modal from "../../components/Modal";
import BtnAzul from "../../components/BtnAzul";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { usuarioServices } from "../../services/usuariosServices";
import { Usuario } from "../../services/usuariosServices";
import Entradas from "../Entrada";
import { SvgSemDados } from "../../components/svgSemDados/svgSemDados";

function Registros() {
  // Filtro por mensagem
  // 0: Produto
  // 1: Categoria
  // 2: Setor
  // 3: Local Armazenamento
  let enumArea: { [name: string]: string[] } = {}
  enumArea = {
    "UPDATE": [],
    "CREATE": []
  }
  //
  enumArea.UPDATE[0] = "teve seu nome alterado para"
  enumArea.UPDATE[1] = "Categoria alterada:"
  enumArea.UPDATE[2] = "Setor \""
  enumArea.UPDATE[3] = "Local de Armazenamento alterado:"
  //
  enumArea.CREATE[0] = "Produto criado:"
  enumArea.CREATE[1] = "Nova categoria criada:"
  enumArea.CREATE[2] = "Setor criado:"
  enumArea.CREATE[3] = "Local de Armazenamento criado:"
  //


  const [showFiltros, setShowFiltros] = useState(false)
  const [filtroKey, setFiltroKey] = useState(0)

  const [tipo, setTipo] = useState<string | null>(null)
  const [area, setArea] = useState<string | null>(null)
  const [admin, setAdmin] = useState<string | null>(null)
  const [dataMax, setDataMax] = useState<string | null>(null)
  const [dataMin, setDataMin] = useState<string | null>(null)
  const [valorMax, setValorMax] = useState<number | null>(null)
  const [valorMin, setValorMin] = useState<number | null>(null)

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [data, setData] = useState<Registro[]>([]);
  const [sistema, setSistema] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  // Salvar informações do json
  const [entradaInfo, setEntradaInfo] = useState<Entrada | null>(null)
  const [saidaInfo, setSaidaInfo] = useState<Saida | null>(null)

  // Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  // Responsavel
  const [responsavel, setResponsavel] = useState<Usuario | null>(null)

  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);

  // FILTROS 
  // Mostrar campo de filtro
  const handleShowFiltros = () => {
    setShowFiltros((prev) => prev ? false : true)
  }

  const handleusUarioChange = (id: number) => {
    const selectedResponsavel = usuarios.find((u) => u.Usuario_id === id);
    setResponsavel(selectedResponsavel || null)
  }

  const handleModoPagina = (reg: Registro[]) => {
    if (!sistema)
      reg = reg.filter((r) => (
        r.Registro_Tipo === "Entrada" || r.Registro_Tipo === "Saida"
      ))
    else
      reg = reg.filter((r) => (
        r.Registro_Tipo !== "Entrada" && r.Registro_Tipo !== "Saida"
      ))

    return reg;
  }

  const handleModoPaginaAsync = (reg: Registro[], sys: boolean) => {
    if (!sys) {
      reg = reg.filter((r) => (
        r.Registro_Tipo === "Entrada" || r.Registro_Tipo === "Saida"
      ))
    }
    else
      reg = reg.filter((r) => (
        r.Registro_Tipo !== "Entrada" && r.Registro_Tipo !== "Saida"
      ))

    return reg;
  }

  // limpar os filtros
  const handleLimparFiltros = () => {
    setRegistros(handleModoPagina(data))
    setDataMin(null)
    setDataMax(null)
    setResponsavel(null)
    setValorMin(null)
    setValorMax(null)
    setTipo(null)
    setArea(null)
    setSearchQuery(null)
    setFiltroKey((prevKey) => prevKey + 1)
  }

  const handleTrocarRegistros = (sys: boolean) => {
    setSistema(sys)


    handleLimparFiltros()
    setRegistros(handleModoPaginaAsync(data, sys))
  }
  useEffect(() => {
    const fetchRegistros = async () => {
      const result = await registrosServices.getAllRegistros();
      if (result instanceof ApiException) {
        console.error(result.message);
      } else {
        setRegistros(handleModoPagina(result))
        setData(result)
        console.log(result)
      }
    };

    const fetchUsuarios = async () => {
      const result = await usuarioServices.getAllUsuarios()
      if (result instanceof ApiException) {
        console.error(result.message);
      } else {
        setUsuarios(result)
      }
    }


    fetchRegistros();
    fetchUsuarios()
  }, []);

  useEffect(() => {
    // Função para aplicar os filtros automaticamente
    const filtrarAutomaticamente = () => {
      let registrosFiltrados = data;
      let saida = "";
      // Filtro extra
      let categoria = "";


      if (searchQuery !== null) {
        saida = searchQuery.toLocaleLowerCase().includes("saí") ? searchQuery.toLowerCase().replace("saí", "sai") : searchQuery;

        registrosFiltrados = registrosFiltrados.filter((r) => (
          r.Registro_Tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.Registro_Repsonsavel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.Registro_Mensagem.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(r.Registro_Data).toLocaleString().toLocaleLowerCase().includes(searchQuery.toLowerCase()) ||
          r.Registro_Tipo.toLowerCase().includes(saida)
        ));
      }

      if (tipo !== null) {
        setAdmin(null)
        if (tipo === "UPDATE")
          categoria = enumArea.UPDATE[1]
        else if (tipo === "CREATE")
          categoria = enumArea.CREATE[1]
        registrosFiltrados = registrosFiltrados.filter((r) =>
          r.Registro_Tipo === tipo || r.Registro_Mensagem.includes(categoria)
        )
      }

      if (responsavel !== null) {
        registrosFiltrados = registrosFiltrados.filter((r) =>
          r.Registro_Repsonsavel === responsavel.Usuario_nome
        )
      }
      if (dataMin !== null) {
        registrosFiltrados = registrosFiltrados.filter((r) =>
          new Date(r.Registro_Data) >= new Date(dataMin)
        );
      }
      if (dataMax !== null) {
        const dataMaxAdjusted = new Date(dataMax);
        dataMaxAdjusted.setDate(dataMaxAdjusted.getDate() + 1);
        registrosFiltrados = registrosFiltrados.filter((r) =>
          new Date(r.Registro_Data) < dataMaxAdjusted
        );
      }

      if (valorMin !== null) {
        registrosFiltrados = registrosFiltrados.filter((r) =>
          r.Registro_ValorTotal !== null && Number(r.Registro_ValorTotal) >= valorMin
        );
      }

      if (valorMax !== null) {
        registrosFiltrados = registrosFiltrados.filter((r) =>
          r.Registro_ValorTotal !== null && Number(r.Registro_ValorTotal) <= valorMax
        );
      }

      if (area !== null) {
        setAdmin(null)
        registrosFiltrados = registrosFiltrados.filter((r) =>
          r.Registro_Mensagem.includes(enumArea.CREATE[parseInt(area)]) || r.Registro_Mensagem.includes(enumArea.UPDATE[parseInt(area)])
        );
      }


      if(admin !== null){
        setArea(null)
        setTipo(null)

      }


      registrosFiltrados = registrosFiltrados.sort((a, b) => new Date(b.Registro_Data).toISOString().localeCompare(new Date(a.Registro_Data).toISOString()))
      registrosFiltrados = handleModoPagina(registrosFiltrados)
      setRegistros(registrosFiltrados);
    };

    filtrarAutomaticamente();



  }, [
    usuarios,
    responsavel,
    dataMin,
    dataMax,
    valorMin,
    valorMax,
    tipo,
    area,
    searchQuery
  ]);



  const handleVisualizarClick = async (id: number, tipo: string) => {
    setOpenModalVisualizar(true);

    if (tipo === "Entrada") {
      const response = await entradaServices.getEntradaByID(id);
      console.log('entrada', response)
      response instanceof ApiException ? alert(response.message) : setEntradaInfo(response);
    } else if (tipo === "Saida") {
      const response = await saidaServices.getSaidaByID(id);
      console.log('saida', response)
      response instanceof ApiException ? alert(response.message) : setSaidaInfo(response);
    }
  };

  const calcularSubtotal = (quantidade: number, custo: number) => {
    return (quantidade * custo).toFixed(2);
  };

  const getIconStyle = (tipo: string) => ({
    color: tipo === "Entrada" ? "#2ecc71" : (tipo === "Saida" ? "#C80000" : "#61BDE0"),
  });

  return (
    <main>
      <div className="registro-header">
        <h1 className="title">Registros</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <SearchBar onSearch={setSearchQuery} />
        <div className="action-end">
          <div className="btnFiltrar"
            onClick={handleShowFiltros}
          >
            <BsFilter size={24} style={{ color: '#61BDE0' }} />
            <span>Filtrar por</span>
          </div>
        </div>
      </div>


      {showFiltros && (sistema ? (
        <>
          <div className="registro-container-filtros">
            <div className="registro-primeira-coluna">
              <div className="tipo-container">
                <label htmlFor="inStatus">Tipo:</label>
                <div className="radio-container">
                  <label htmlFor="inAtivo">Criado</label>
                  <input
                    type="radio"
                    name="inStatus"
                    id="inAtivo"
                    value="CREATE"
                    checked={tipo === "CREATE"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                </div>
                <div className="radio-container">
                  <label htmlFor="inInativo">Alterado</label>
                  <input
                    type="radio"
                    name="inStatus"
                    id="inInativo"
                    value="UPDATE"
                    checked={tipo === "UPDATE"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                </div>
              </div>
              <div className="area-container">
                <label htmlFor="inArea">Área:</label>
                <div>
                  <div className="area-container-prod">
                    <div className="radio-container">
                      <label htmlFor="inProd">Produto</label>
                      <input
                        type="radio"
                        name="inArea"
                        id="inProd"
                        value="0"
                        checked={area === "0"}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="radio-container">
                      <label htmlFor="inCat">Categoria</label>
                      <input
                        type="radio"
                        name="inArea"
                        id="inCat"
                        value="1"
                        checked={area === "1"}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="area-container-setor">
                    <div className="radio-container">
                      <label htmlFor="inSet">Setor</label>
                      <input
                        type="radio"
                        name="inArea"
                        id="inSet"
                        value="2"
                        checked={area === "2"}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="radio-container">
                      <label htmlFor="inLoc">Local</label>
                      <input
                        type="radio"
                        name="inArea"
                        id="inLoc"
                        value="3"
                        checked={area === "3"}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="registro-ultima-coluna">
              <div className="responsavel-container" key={filtroKey}>
                <label htmlFor="inusuarios">Responsável:</label>
                <select
                  id="inusuarios"
                  className="form-select-custom"
                  onChange={(e) => handleusUarioChange(+e.target.value)}
                >
                  <option selected>Buscar...</option>
                  {usuarios.map((u) => (
                    <option key={u.Usuario_id} value={u.Usuario_id}>
                      {u.Usuario_nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="filtros-btn">
            <button className="rfloat btnLimpar" onClick={handleLimparFiltros}>LIMPAR</button>
          </div>
        </>
      ) : (
        <>
          <div className="registro-container-filtros">
            <div className="registro-primeira-coluna">
              <div className="tipo-container">
                <label htmlFor="inStatus">Tipo:</label>
                <div className="radio-container">
                  <label htmlFor="inAtivo">Entrada</label>
                  <input
                    type="radio"
                    name="inStatus"
                    id="inAtivo"
                    value="Entrada"
                    checked={tipo === "Entrada"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                </div>
                <div className="radio-container">
                  <label htmlFor="inInativo">Saída</label>
                  <input
                    type="radio"
                    name="inStatus"
                    id="inInativo"
                    value="Saida"
                    checked={tipo === "Saida"}
                    onChange={(e) => setTipo(e.target.value)}
                  />
                </div>
              </div>
              <div className="valor-container">
                <label htmlFor="inVenda">Valor:</label>
                <div>
                  <input
                    type="number"
                    id="inValor"
                    value={valorMin ?? ""}
                    onChange={(e) => setValorMin(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    id="inValor"
                    value={valorMax ?? ""}
                    onChange={(e) => setValorMax(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Máx"
                  />
                </div>
              </div>
            </div>
            <div className="registro-ultima-coluna">
              <div className="responsavel-container" key={filtroKey}>
                <label htmlFor="inusuarios">Responsável:</label>
                <select
                  id="inusuarios"
                  className="form-select-custom"
                  onChange={(e) => handleusUarioChange(+e.target.value)}
                >
                  <option selected>Buscar...</option>
                  {usuarios.map((u) => (
                    <option key={u.Usuario_id} value={u.Usuario_id}>
                      {u.Usuario_nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="data-container">
                <label htmlFor="inData">Data:</label>
                <div>
                  <input
                    type="date"
                    id="inData"
                    value={dataMin || ""}
                    onChange={(e) => setDataMin(e.target.value ? e.target.value : null)}
                    placeholder="Min"
                  />
                  <input
                    type="date"
                    id="inData"
                    value={dataMax || ""}
                    onChange={(e) => setDataMax(e.target.value ? e.target.value : null)}
                    placeholder="Máx"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="filtros-btn">
            <button className="rfloat btnLimpar" onClick={handleLimparFiltros}>LIMPAR</button>
          </div>
        </>
      ))
      }

      <div className="registro-menu">
        <div className={sistema === true ? 'registro-menu-item' : 'registro-menu-item active'} onClick={() => handleTrocarRegistros(false)}>
          <div className="registro-menu-text"><span>OPERAÇÕES</span></div>
        </div>
        <div className={sistema === false ? 'registro-menu-item' : 'registro-menu-item active'} onClick={() => handleTrocarRegistros(true)}>
          <div className="registro-menu-text"><span>SISTEMA</span></div>
        </div>
      </div>


      <div className="registros-container">
        {registros.map((registro) => !sistema ? (
          <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
            <FaRegArrowAltCircleRight className="icon" style={getIconStyle(registro.Registro_Tipo)} />
            <div className="info">
              <div className="info-title">
                <h2>{registro.Registro_Tipo}</h2>
                <BsLink45Deg color="#61BDE0" size={25} onClick={() => handleVisualizarClick(registro.Registro_Chave, registro.Registro_Tipo)} />
              </div>
              <div className="info-body">
                <span>{registro.Registro_Mensagem}</span>
                <span>Responsável: {registro.Registro_Repsonsavel} - {new Date(registro.Registro_Data).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
            <PiInfo className="icon" style={getIconStyle(registro.Registro_Tipo)} />
            <div className="info">
              <div className="info-title">
                <h2>{registro.Registro_Mensagem}</h2>
              </div>
              <div className="info-body">
                <span>Alteração feita por: {registro.Registro_Repsonsavel}</span>
                <span>{new Date(registro.Registro_Data).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )
        )}
      </div>

      <SvgSemDados data={registros} />

      {/* Modal de Visualização */}
      <Modal
        isOpen={openModalVisualizar}
        label={`Detalhes`}
        buttons={
          <BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => { setOpenModalVisualizar(false); setEntradaInfo(null); setSaidaInfo(null) }} />
        }
        className="modal-content-visualizar"
      >
        {entradaInfo ? (
          <div className="modal-content">
            {/* PRODUTOS */}
            <div className="grid-container">
              <h3 className="modal-title">Produtos</h3>
              <hr />
            </div>

            <div className="lotes-visualizar">
              {entradaInfo.Lotes?.map((lote, index) => (
                <div key={index} className="lote-container">
                  <div className="produto-info">
                    <h5><strong>{lote.Produtos?.Prod_nome}</strong></h5>
                    <div className="info-row">
                      <div className="info-item">
                        <span>Quantidade</span>
                        <span>{lote.Lote_Entrada?.Ent_quantidade}</span>
                      </div>
                      <div className="info-item">
                        <span>Custo</span>
                        <span>R${Number(lote.Produtos?.Prod_custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="info-item">
                        <span>Fornecedor</span>
                        <span>{lote.Fornecedores?.Forn_nome ?? 'Fornecedor não informado'}</span>
                      </div>
                      <div className="info-item">
                        <span>Lote</span>
                        <span>{lote.Lote_cod}</span>
                      </div>
                      <div className="info-item">
                        <span>Validade</span>
                        <span>{lote.Lote_validade == null ? "-" : new Date(lote.Lote_validade).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span>Local de armazenamento</span>
                        <span>{lote.Locais_Armazenamento?.LocAr_nome}</span>
                      </div>
                      <div className="info-item">
                        <span>Subtotal</span>
                        <span>R${Number(calcularSubtotal(lote.Lote_Entrada?.Ent_quantidade!, parseFloat(lote.Produtos?.Prod_custo || '0'))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/*DETALHES */}
            <div className="grid-container">
              <h3 className="modal-title">Detalhes</h3>
              <hr />
            </div>

            <div className="detalhes-container">
              <p><strong>Total: </strong>R${Number(entradaInfo.Ent_valortot).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Data: </strong>{new Date(entradaInfo.Ent_dataCriacao).toLocaleDateString()}</p>
              <p><strong>Realizado por: </strong>{entradaInfo.Usuario?.Usuario_nome}</p>
            </div>
          </div>
        ) : saidaInfo ? (
          <div className="modal-content">
            {/* PRODUTOS */}
            <div className="grid-container">
              <h3 className="modal-title">Produtos</h3>
              <hr />
            </div>

            <div className="lotes-visualizar">
              {saidaInfo.Lotes?.map((lote, index) => (
                <div key={index} className="lote-container">
                  <div className="produto-info">
                    <h5><strong>{lote.Produtos?.Prod_nome}</strong></h5>
                    <div className="info-row">
                      <div className="info-item">
                        <span>Quantidade</span>
                        <span>{lote.Lote_Saida?.Saida_quantidade!}</span>
                      </div>
                      <div className="info-item">
                        <span>Custo</span>
                        <span>R${Number(lote.Produtos?.Prod_custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="info-item">
                        <span>Fornecedor</span>
                        <span>{lote.Fornecedores?.Forn_nome ?? 'Fornecedor não informado'}</span>
                      </div>
                      <div className="info-item">
                        <span>Lote</span>
                        <span>{lote.Lote_cod}</span>
                      </div>
                      <div className="info-item">
                        <span>Validade</span>
                        <span>{lote.Lote_validade == null ? "-" : new Date(lote.Lote_validade).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span>Local de armazenamento</span>
                        <span>{lote.Locais_Armazenamento?.LocAr_nome}</span>
                      </div>
                      <div className="info-item">
                        <span>Subtotal</span>
                        <span>R${Number(calcularSubtotal(lote.Lote_Saida?.Saida_quantidade!, parseFloat(lote.Produtos?.Prod_custo || '0'))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/*DETALHES */}
            <div className="grid-container">
              <h3 className="modal-title">Detalhes</h3>
              <hr />
            </div>

            <div className="detalhes-container">
              <p><strong>Total: </strong>R${Number(saidaInfo.Saida_valorTot).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Data: </strong>{new Date(saidaInfo.Saida_dataCriacao).toLocaleDateString()}</p>
              <p><strong>Realizado por: </strong>{saidaInfo.Usuarios?.Usuario_nome}</p>
            </div>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </Modal>

    </main >
  );
}

export default Registros;
