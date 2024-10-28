import React, { useState, useEffect, useRef } from "react";
import InputBusca from "../../components/InputBusca";
import { IoAddCircleOutline } from "react-icons/io5";
import BtnAzul from "../../components/BtnAzul";
import './style.css'
import '../../style/global.css'
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Card from "../../components/Card";
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { Local_Armazenamento, localServices } from "../../services/localServices";
import { ApiException } from "../../config/apiException";
import BtnCancelar from "../../components/BtnCancelar";
import LocalFormulario from "../../components/Formularios/Locais/Local_Cadastrar";
import Local_Editar from "../../components/Formularios/Locais/Local_Editar";
import { Link, useParams } from "react-router-dom";
import { Setor, setoresServices } from "../../services/setorServices";

import { useAuth } from "../../context/AuthProvider";

function LocalArmazenamento() {
  const [openModalCadastro, setOpenModalCadastro] = useState(false)
  const [openModalEdicao, setOpenModalEdicao] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  
  const [locais, setLocais] = useState<Local_Armazenamento[]>([]);

  const [setor, setSetor] = useState<Setor>();

  // Guarda o ID de setor recebido na rota e converte para int
  const { id } = useParams();
  const idInt = id ? parseInt(id, 10) : null

  //Verificação dos Cargos
  const {currentUser} = useAuth();

  // Guarda o ID dos fornecedores selecionados na tabela
  const [localSelecionado, setlocalSelecionado] = useState<number | null>(null);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // FUNÇÕES PARA EVENTO DE MODALS
// Edição
const handleEditClick = (id: number) => {
  setlocalSelecionado(id)
  setOpenModalEdicao(true) // Abre o modal de edição
}

const closeEditModal = () => {
  setlocalSelecionado(null)
  setOpenModalEdicao(false)
}

  const fetchLocais = async () => {
      const result = await localServices.getLocaisBySetor(idInt!)
      if (result instanceof ApiException) {
        console.log(result.message)
      } else {
        setLocais(result);
      }
  }

  const fetchSetor = async () => {
    const result = await setoresServices.getSetorByID(idInt!)
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setSetor(result);
    }
}

  useEffect(() => {
      fetchLocais()
      fetchSetor()
  }, [])

  return (
      <main>
        <div className="page-title">
          <h1 className="title"> {setor?.Setor_nome} - Locais de Armazenamento</h1>
          <hr className="line" />
        </div>


          {/* Barra de pesquisa */}
          {/* <div className="inputButton">
              <InputBusca />
              <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={() => setOpenModalCadastro(true)} />
          </div> */}


          {currentUser?.Cargo_id === 2 && (
          <div className="actions-group">
            <BtnAzul className="rfloat" icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
          </div>
          )}

      
          <div className="cards-group">
          {locais.map(local => (
              <Card className="card-i">
                  <span>{local.LocAr_nome}</span> 
                  <div className="actions">
                    {currentUser?.Cargo_id === 2 && (
                      <FiEdit2 color="#61BDE0" size={20} className="edit-icon"  onClick={() => handleEditClick(local.LocAr_id)}/>
                    )}
                    <Link to={`/LocalProduto/${local.LocAr_id}`}><IoIosArrowForward color="#61BDE0" size={25} /></Link>
                  </div>
              </Card>
          ))}
          </div>

          {/* MODALS*/}
    {/* Modal de Cadastro */}
    <Modal
      isOpen={openModalCadastro} // Abre o modal
      label="Cadastrar Local de Armazenamento" // Titulo do modal
      buttons={
        <>
          <BtnCancelar onClick={() => setOpenModalCadastro(false)} /> {/*Fechar o modal */}
          <BtnAzul
            icon={<IoAddCircleOutline />}
            label="CADASTRAR"
            onClick={() => formRef.current?.submitForm()} /* Passa a função da referencia do formulario para poder enviar o submit */
          />
        </>
      }
    >
      <LocalFormulario
        ref={formRef} /* Passa a referencia do formulario */
        onSuccess={message => {
          setMensagemSucesso(message) 
          setOpenModalCadastro(false)
          fetchLocais() // Atualiza a tabela
        }}
      />
    </Modal>

     {/* Modal de Edição */}
     {localSelecionado && (
      <Modal
        isOpen={openModalEdicao}
        label="Editar Local"
        buttons={
          <>
            <BtnCancelar onClick={closeEditModal} />
            <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
          </>
        }
      >
        <Local_Editar
          ref={formRef}
          id={localSelecionado}
          onSuccess={message => {
            setMensagemSucesso(message)
            closeEditModal()
            fetchLocais() // Atualiza a tabela após edição
          }}
        />
      </Modal>
    )}
          
      </main>
  )
}

export default LocalArmazenamento