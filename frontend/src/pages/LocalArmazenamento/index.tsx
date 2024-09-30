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

function LocalArmazenamento() {
    const [openModalCadastro, setOpenModalCadastro] = useState(false)
    const [openModalEdicao, setOpenModalEdicao] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    
    const [locais, setLocais] = useState<Local_Armazenamento[]>([]);

    
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
        const result = await localServices.getAllLocais()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
          setLocais(result);
        }
    }

    useEffect(() => {
        fetchLocais()
    }, [])

    return (
        <main>
            <h1 className="title">Local Armazenamento</h1>

            <div className="inputButton">
                <InputBusca />
                <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={() => setOpenModalCadastro(true)} />
            </div>

        
            <div className="cards-group">
            {locais.map(local => (
                <Card className="card-item">
                    <span>{local.LocAr_nome}</span> 
                    <div className="actions">
                        <FiEdit2 color="#61BDE0" size={20} className="edit-icon"  onClick={() => handleEditClick(local.LocAr_id)}/>
                        <IoIosArrowForward color="#61BDE0" size={25} />
                    </div>
                </Card>
            ))}
            </div>

            {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Local de Armazenamento" // Titulo do modal
        setModalOpen={() => setOpenModalCadastro(false)} // Função para fechar dentro do modal
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
          setModalOpen={closeEditModal}
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