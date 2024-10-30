import React, { useState, useEffect } from "react";
import { ApiException } from "../../config/apiException";
import { Registro, registrosServices } from "../../services/registrosServices";
import { FaRegArrowAltCircleRight } from "react-icons/fa"; // Importando o ícone
import './style.css';
import { BsLink45Deg } from "react-icons/bs";
import { Entrada, entradaServices } from "../../services/entradaServices";
import { Saida, saidaServices } from "../../services/saidaServices";
import Modal from "../../components/Modal";
import BtnAzul from "../../components/BtnAzul";
import { IoArrowBackCircleOutline } from "react-icons/io5";

function Registros() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [registroSelecionado, setRegistroSelecionado] = useState<number | null>(null);

  // Salvar informações do json
  const [entradaInfo, setEntradaInfo] = useState<Entrada | null>(null)
  const [saidaInfo, setSaidaInfo] = useState<Saida | null>(null)
  
  
  const [openModalVisualizar, setOpenModalVisualizar] = useState(false);

  useEffect(() => {
    const fetchRegistros = async () => {
      const result = await registrosServices.getAllRegistros();
      if (result instanceof ApiException) {
        console.error(result.message);
      } else {

        setRegistros(result);
      }
    };

    fetchRegistros();
  }, []);

  const handleVisualizarClick = async (id: number, tipo: string) => {
    setRegistroSelecionado(id);
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
    color: tipo === "Entrada" ? "#2ecc71" : "#C80000",
  });

  return (
    <main>
      <h1 className="title">Registros</h1>
      <div className="registros-container">
        {registros.map((registro) => (
          <div key={registro.Registro_id} className={`registro-item ${registro.Registro_Tipo.toLowerCase()}`}>
            <FaRegArrowAltCircleRight className="icon" style={getIconStyle(registro.Registro_Tipo)} />
            <div className="info">
              <div className="info-title">
                <h2>{registro.Registro_Tipo === "Saida" ? "Saída" : "Entrada"}</h2>
                <BsLink45Deg color="#61BDE0" size={25} onClick={() => handleVisualizarClick(registro.Registro_Chave, registro.Registro_Tipo)} />
              </div>
              <div className="info-body">
                <span>{registro.Registro_Mensagem}</span>
                <span>Responsável: {registro.Registro_Repsonsavel} - {new Date(registro.Registro_Data).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                                <span>{new Date(lote.Lote_validade).toLocaleDateString()}</span>
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
                                <span>{new Date(lote.Lote_validade).toLocaleDateString()}</span>
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

    </main>
  );
}

export default Registros;
