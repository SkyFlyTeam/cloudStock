import React, { useState, useEffect, Component } from "react";
import { produtosServices } from "../../services/produtoServices";
import { ApiException } from "../../config/apiException";
import { Produto } from "../../services/produtoServices";
//
import { IoAddCircleOutline } from "react-icons/io5";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";
import TextBox from "../../components/TextBox";
import Input from "../../components/Input";
import DivTitulo from "../../components/DivTitulo";
import './style.css'
import BtnAzul from "../../components/BtnAzul";



document.body.classList.add("scroll")

type state = {
    // prod_cod: string
    Prod_nome: string
    Prod_descricao: string
    Prod_preco: number
    Prod_custo: number
    Prod_peso: number
    Prod_altura: number
    Prod_largura: number
    Prod_comprimento: number
    Prod_marca: string
    Prod_modelo: string
    Prod_validade: boolean
    Prod_quantidade: number
    Categoria_id: any
    UnidadeMedida_id: any
    Prod_img: File | null
    Produtos: Produto[]
}








// APENAS UM PROTÓTIPO
class Cadastrar extends Component<any, state> {
    constructor(props: any) {
        super(props)
        this.state = {
            // prod_cod: '',
            Prod_nome: '',
            Prod_descricao: '',
            Prod_preco: 0,
            Prod_custo: 0,
            Prod_peso: 0,
            Prod_altura: 0,
            Prod_largura: 0,
            Prod_comprimento: 0,
            Prod_marca: '',
            Prod_modelo: '',
            Prod_validade: false,
            Prod_quantidade: 0,
            Categoria_id: null,
            UnidadeMedida_id: null,
            Prod_img: null,
            Produtos: []
        }
    }

    componentDidMount() {
        produtosServices.getAllProdutos()
            .then((result) => {
                if (result instanceof ApiException) {
                    alert(result.message);
                } else {
                    this.setState({ Produtos: result })
                }
            })
    }

    eventoFormulario = async (evento: any) => {
        evento.preventDefault();

        const formData = new FormData();
        // const { prod_cod, prod_nome, P, prod_img } = this.state;
        const {
            Prod_nome,
            Prod_descricao,
            Prod_preco,
            Prod_custo,
            Prod_peso,
            Prod_altura,
            Prod_largura,
            Prod_comprimento,
            Prod_marca,
            Prod_modelo,
            Prod_validade,
            Prod_quantidade,
            Categoria_id,
            UnidadeMedida_id,
            Prod_img
        } = this.state;


        // Adicione os dados do produto
        // formData.append('Prod_cod', prod_cod);
        formData.append('Prod_nome', Prod_nome);
        formData.append('Prod_descricao', Prod_descricao);
        formData.append('Prod_preco', Prod_preco.toString());
        formData.append('Prod_custo', Prod_custo.toString());
        formData.append('Prod_peso', Prod_peso.toString());
        formData.append('Prod_altura', Prod_altura.toString());
        formData.append('Prod_largura', Prod_largura.toString());
        formData.append('Prod_comprimento', Prod_comprimento.toString());
        formData.append('Prod_marca', Prod_marca);
        formData.append('Prod_modelo', Prod_modelo);
        formData.append('Prod_validade', Prod_validade.toString());
        formData.append('Prod_quantidade', Prod_quantidade.toString());


        // Adicione o arquivo de imagem, se houver
        if (Prod_img) {
            formData.append('Prod_imagem', Prod_img);
        }


        if (Categoria_id) {
            formData.append('Categoria_id', Categoria_id.toString());
        }

        if (UnidadeMedida_id) {
            formData.append('UnidadeMedida_id', UnidadeMedida_id.toString());
        }

        try {
            const response = await produtosServices.createProduto(formData);
            if (response instanceof ApiException) {
                console.error(response.message);
            } else {
                console.log("Produto criado com sucesso:", response);
                this.setState((prevState) => ({
                    Produtos: [...prevState.Produtos, response],
                    // prod_cod: '',
                    Prod_nome: '',
                    Prod_descricao: '',
                    Prod_preco: 0,
                    Prod_custo: 0,
                    Prod_peso: 0,
                    Prod_altura: 0,
                    Prod_largura: 0,
                    Prod_comprimento: 0,
                    Prod_marca: '',
                    Prod_modelo: '',
                    Prod_validade: false,
                    Prod_quantidade: 0,
                    Categoria_id: null,
                    UnidadeMedida_id: null,
                    Prod_img: null,
                }));
            }
        } catch (error) {
            console.error('Erro ao enviar o produto:', error);
        }
    }

    // obterCodigo = (evento: any) => {
    //   this.setState({ prod_cod: evento.target.value })
    // }

    obterNome = (evento: any) => {
        this.setState({ Prod_nome: evento.target.value })
    }
    obterDescricao = (evento: any) => {
        this.setState({ Prod_descricao: evento.target.value })
    }
    //
    obterPreco = (evento: any) => {
        this.setState({ Prod_preco: parseFloat(evento.target.value) });
    }
    obterCusto = (evento: any) => {
        this.setState({ Prod_custo: parseFloat(evento.target.value) });
    }
    obterPeso = (evento: any) => {
        this.setState({ Prod_peso: parseFloat(evento.target.value) });
    }
    obterAltura = (evento: any) => {
        this.setState({ Prod_altura: parseFloat(evento.target.value) });
    }
    obterLargura = (evento: any) => {
        this.setState({ Prod_largura: parseFloat(evento.target.value) });
    }
    obterComprimento = (evento: any) => {
        this.setState({ Prod_comprimento: parseFloat(evento.target.value) });
    }
    //
    obterMarca = (evento: any) => {
        this.setState({ Prod_marca: evento.target.value })
    }
    obterModelo = (evento: any) => {
        this.setState({ Prod_modelo: evento.target.value })
    }
    //
    obterValidade = (evento: any) => {
        this.setState({ Prod_validade: (evento.target.value === 'true') });
    }
    obterQuantidade = (evento: any) => {
        this.setState({ Prod_quantidade: parseInt(evento.target.value) });
    }
    //
    obterCategoria = (evento: any) => {
        this.setState({ Categoria_id: parseInt(evento.target.value) });
    }
    obterUnidade = (evento: any) => {
        this.setState({ UnidadeMedida_id: parseInt(evento.target.value) });
    }
    receberArquivo = (evento: any) => {
        this.setState({ Prod_img: evento.target.files[0] });
    }


    render() {
        return (
            <main>
                {/* Template começa aqui */}
                <form className="scroller" encType="multipart/form-data" onSubmit={this.eventoFormulario}>
                    <div>
                        <h2>Cadastrar Produto</h2>
                        {/* PARA O OTÁRIO DO FUTURO (VULGO ARTHUR): Lembrar de transformar isso tudo num único Flex Row para versão Mobile! */}
                        <div className="dual rflex nwflex">
                            <div className="flex2 cflex nwflex spacerChild"> {/* Coluna dupla: [1] [2] */}
                                {/* Linha: [1] */}
                                <Input className=""
                                    label="Nome"
                                    placeholder="Nome do produto"
                                    onChange={this.obterNome}
                                />
                                {/* Linha: [2] */}
                                <div className="dual rflex nwflex">
                                    <Input className="flex1"
                                        label="Marca"
                                        placeholder="Marca"
                                        onChange={this.obterMarca}
                                    />
                                    <Input className="flex1"
                                        label="Modelo"
                                        placeholder="Modelo"
                                        onChange={this.obterModelo}
                                    />
                                </div>
                                {/* Linha: [3] */}
                                <div className="dual rflex nwflex">
                                    <Input className="flex1"
                                        label="Custo"
                                        placeholder="Custo"
                                        onChange={this.obterCusto}
                                    />
                                    <Input className="flex1"
                                        label="Venda"
                                        placeholder="Venda"
                                        value=""
                                        //onChange={this.obterVenda}
                                    />
                                </div>
                            </div>

                            <div className="flex1 cflex nwflex spacerChild"> {/* Coluna simples: [3] */}
                                {/* Linha: [1] */}
                                <Input className="flex1"
                                    label="Código"
                                    placeholder="Código do produto"
                                    value=""
                                    //onChange={this.obter}
                                />
                                {/* Linha: [2] */}
                                <Input className="flex1"
                                    label="Categoria"
                                    placeholder="Selecione..."
                                    value=""
                                    //onChange={this.obterCategoria}
                                />
                                {/* Linha: [3] */}
                                <Input className="flex1"
                                    label="Quantidade"
                                    placeholder="Quantidade"
                                    onChange={this.obterQuantidade}
                                />
                                {/* Usar este aqui após terminado como gambiarra
                            Uma solução melhor é NECESSÁRIA!
                            <div className="flex1"></div>
                            */}
                            </div>
                        </div>
                    </div>

                    <div className="nextSect">
                        <DivTitulo className=""
                            label="Especificações"
                        />
                        <div className="spacerChild">
                            {/* Linha: [1] */}
                            <Input className="unidadeMedida"
                                label="Unidade de Medida"
                                placeholder="Selecione"
                                value=""
                                //onChange={this.obterUnidade}
                            />
                            {/* Linha: [2] */}
                            <div className="dual rflex nwflex">
                                <Input className="flex1"
                                    label="Peso"
                                    placeholder="Peso"
                                    onChange={this.obterPeso}
                                />
                                <Input className="flex1"
                                    label="Largura"
                                    placeholder="Largura"
                                    onChange={this.obterLargura}
                                />
                                <Input className="flex1"
                                    label="Comprimento"
                                    placeholder="Comprimento"
                                    onChange={this.obterComprimento}
                                />
                                <Input className="flex1"
                                    label="Altura"
                                    placeholder="Altura"
                                    onChange={this.obterAltura}
                                />
                            </div>
                            {/* Linha: [3] */}
                            <div>
                                <label>Possui validade?</label>
                                <label><input type="radio" className="radioValid" name="prod_validade" placeholder="True" onChange={this.obterValidade} /><span className="radioValid">Sim</span></label>
                                <label><input type="radio" className="radioValid" name="prod_validade" placeholder="False" /><span className="radioValid">Não</span></label>
                            </div>
                            {/* Criar component RadioButton!! */}
                        </div>
                    </div>

                    <div className="nextSect">
                        <DivTitulo className=""
                            label="Detalhes"
                        />
                        <div className="spacerChild">
                            {/* Linha: [1] */}
                            <Input className="unidadeMedida"
                                label="Localização no estoque"
                                placeholder="Localização de armazenamento..."
                                value=""
                            />
                            {/* Linha: [2] */}
                            <Input className=""
                                label="Descrição"
                                placeholder="Descreva o produto..."
                                onChange={this.obterDescricao}
                            />
                            {/* Linha: [3] */}
                            <Input className=""
                                label="Imagem do Produto"
                                placeholder="<< UPLOAD >>"
                                value=""
                            //onChange={this.receberArquivo}
                            />
                        </div>
                    </div>
                    <BtnAzul
                        icon={<IoAddCircleOutline />}
                        label='CADASTRAR'
                    />
                </form>
                {/* Template termina aqui */}
            </main>
        )
    }
}

export default Cadastrar