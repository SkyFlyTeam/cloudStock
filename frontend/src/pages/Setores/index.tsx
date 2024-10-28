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
import { ApiException } from "../../config/apiException";
import BtnCancelar from "../../components/BtnCancelar";
import { Setor, setoresServices } from "../../services/setorServices";
import SetorFormulario from "../../components/Formularios/Setores/Setor_Cadastrar";
import Setor_editar from "../../components/Formularios/Setores/Setor_Editar";
import { Link } from "react-router-dom";


//Verificação dos cargos
import { useAuth } from "../../context/AuthProvider";

function Setores() {
    const [openModalCadastro, setOpenModalCadastro] = useState(false)
    const [openModalEdicao, setOpenModalEdicao] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    
    const [name, setName] = useState('')
    const [sector, setSector] = useState('')
    const [setores, setSetores] = useState<Setor[]>([]);

    // Guarda o ID dos fornecedores selecionados na tabela
    const [setorSelecionado, setSetorSelecionado] = useState<number | null>(null);

    // Verificação dos Cargos
    const {currentUser} = useAuth();

    // Mensagem de sucesso das ações
    const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

    // Referência ao forms para realizar o submit fora do componente do forms
    const formRef = useRef<{ submitForm: () => void }>(null);

    const handleEditClick = (id: number) => {
      setSetorSelecionado(id)
      setOpenModalEdicao(true) // Abre o modal de edição
    }
  
    const closeEditModal = () => {
      setSetorSelecionado(null)
      setOpenModalEdicao(false)
    }



    const fetchSetores = async () => {
        const result = await setoresServices.getAllSetores()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
          setSetores(result);
        }
    }

    useEffect(() => {
        fetchSetores()
    }, [])

    return (
        <main>
          <div className="page-title">
            <h1 className="title">Setores</h1>
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
            {setores.map(setor => (
                <Card className="card-i">
                    <span>{setor.Setor_nome}</span> 
                    <div className="actions">
                      {currentUser?.Cargo_id === 2 && (
                        <FiEdit2 color="#61BDE0" size={20} className="edit-icon" onClick={() => handleEditClick(setor.Setor_id)}/> 
                      )}
                      <Link to={`/LocalArmazenamento/${setor.Setor_id}`}><IoIosArrowForward color="#61BDE0" size={25} /></Link>
                    </div>
                </Card>
            ))}
            </div>

      {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Setor" // Titulo do modal
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
        <SetorFormulario
          ref={formRef} /* Passa a referencia do formulario */
          onSuccess={(message: React.SetStateAction<string>)  => {
            setMensagemSucesso(message) 
            setOpenModalCadastro(false)
            fetchSetores() // Atualiza a tabela
          }}
        />
      </Modal>

      {/* Modal de Edição */}
      {setorSelecionado && (
        <Modal
          isOpen={openModalEdicao}
          label="Editar Setor"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <Setor_editar
            ref={formRef}
            id={setorSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              fetchSetores(); // Atualiza a tabela após edição
            }}
          />
        </Modal>
      )}
            
        </main>
    )
}

export default Setores