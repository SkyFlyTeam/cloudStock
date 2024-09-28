import React, { useState, useEffect } from "react";
import InputBusca from "../../components/InputBusca";
import { IoAddCircleOutline } from "react-icons/io5";
import BtnAzul from "../../components/BtnAzul";
import './style.css'
import '../../style/global.css'
import Modal from "../../components/Modal";
import Input from "../../components/Input";

function LocalArmazenamento() {
    const [openModal, setOpenModal] = useState(false)
    const [name, setName] = useState('')
    const [sector, setSector] = useState('')

    return (
        <>
            <h1 className="title">Local Armazenamento</h1>

            <div className="inputButton">
                <InputBusca />
                <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={() => setOpenModal(true)} />
            </div>

            <Modal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)} label='Cadastrar local'>
                <div className="inputEspaçamento">
                    <Input
                        label="Nome"
                        placeholder="Razão social"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Setor"
                        type="select"
                        value={sector}
                        placeholder="Selecione..."
                        options={['Tecnologia', 'Financeiro', 'Marketing']} /* select com testes */
                        onChange={(e) => setSector(e.target.value)}
                    />
                </div>
            </Modal>

        </>

    )
}

export default LocalArmazenamento