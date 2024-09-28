import React, { useState, useEffect } from "react";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";
import TextBox from "../../components/TextBox";
import DivTitulo from "../../components/DivTitulo";
import './style.css'

// APENAS UM PROTÓTIPO

function Cadastrar() {
    return (
        <main>
            <div className="page-title">
                <hr className="line" />
            </div>

            {/* Template começa aqui */}
            <form>
                <div>
                    <h2>Cadastrar Produto</h2>
                    <div className="dual rflex nwflex">
                        <div className="flex2 cflex nwflex spacerChild"> {/* Coluna dupla: [1] [2] */}
                            {/* Linha: [1] */}
                            <TextBox className=""
                                name="prod_nome"
                                title="Nome"
                                value="Nome do produto"
                            />
                            {/* Linha: [2] */}
                            <div className="dual rflex nwflex">
                                <TextBox className="flex1"
                                    name="prod_marca"
                                    title="Marca"
                                    value="Marca"
                                />
                                <TextBox className="flex1"
                                    name="prod_modelo"
                                    title="Modelo"
                                    value="Modelo"
                                />
                            </div>
                            {/* Linha: [3] */}
                            <div className="dual rflex nwflex">
                                <TextBox className="flex1"
                                    name="prod_custo"
                                    title="Custo"
                                    value="Custo"
                                />
                                <TextBox className="flex1"
                                    name="prod_venda"
                                    title="Venda"
                                    value="Venda"
                                />
                            </div>
                        </div>

                        <div className="flex1 cflex nwflex spacerChild"> {/* Coluna simples: [3] */}
                            {/* Linha: [1] */}
                            <TextBox className="flex1"
                                name="prod_cod"
                                title="Código"
                                value="Código do produto"
                            />
                            {/* Linha: [2] */}
                            <TextBox className="flex1"
                                name="Categoria_id"
                                title="Categoria"
                                value="Selecione..."
                            />
                            {/* Linha: [3] */}
                            <TextBox className="flex1"
                                name="prod_quantidade"
                                title="Quantidade"
                                value="Quantidade"
                            />
                            {/* Usar este aqui após terminado como gambiarra
                            Uma solução melhor é recomendado!
                            <div className="flex1"></div>
                            */}
                        </div>
                    </div>
                </div>

                <div className="nextSect">
                    <DivTitulo className=""
                        title="Especificações"
                    />
                    <div className="spacerChild">
                        {/* Linha: [1] */}
                        <TextBox className="unidadeMedida"
                            name="UnidadeMedida_id"
                            title="Unidade de Medida"
                            value="Selecione"
                        />
                        {/* Linha: [2] */}
                        <div className="dual rflex nwflex">
                            <TextBox className="flex1"
                                name="prod_peso"
                                title="Peso"
                                value="Peso"
                            />
                            <TextBox className="flex1"
                                name="prod_largura"
                                title="Largura"
                                value="Largura"
                            />
                            <TextBox className="flex1"
                                name="prod_comprimento"
                                title="Comprimento"
                                value="Comprimento"
                            />
                            <TextBox className="flex1"
                                name="prod_altura"
                                title="Altura"
                                value="Altura"
                            />
                        </div>
                        {/* Linha: [3] */}
                        <div>
                            <label>Possui validade?</label>
                            <label><input type="radio" className="radioValid" name="prod_validade" value="True" /><span className="radioValid">Sim</span></label>
                            <label><input type="radio" className="radioValid" name="prod_validade" value="False" /><span className="radioValid">Não</span></label>
                        </div>
                        {/* Criar component RadioButton!! */}
                    </div>
                </div>

                <div className="nextSect">
                    <DivTitulo className=""
                        title="Detalhes"
                    />
                    <div className="spacerChild">
                        {/* Linha: [1] */}
                        <TextBox className="unidadeMedida"
                            name=""
                            title="Localização no estoque"
                            value="Localização de armazenamento..."
                        />
                        {/* Linha: [2] */}
                        <TextBox className=""
                            name="prod_desc"
                            title="Descrição"
                            value="Descreva o produto..."
                        />
                        {/* Linha: [3] */}
                        <TextBox className=""
                            name=""
                            title="Imagem do Produto"
                            value="<< UPLOAD >>"
                        />
                    </div>
                </div>
            </form>
            {/* Template termina aqui */}
        </main>
    )
}

export default Cadastrar