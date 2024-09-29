import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';
//
import { IoAddCircleOutline } from "react-icons/io5";
import Input from "../../../Input";
import DivTitulo from "../../../DivTitulo";
import './style.css'
import BtnAzul from "../../../BtnAzul";

interface Props {
    onSuccess: (message: string) => void // Função pra quando dê certo 
}

const ProdutoFormulario = forwardRef((props: Props, ref: Ref<{
submitForm: () => void }>) => {
    const [Prod_nome, setNome] = useState<string>('')
    const [Prod_descricao, setDescricao] = useState<string>('')
    const [Prod_preco, setPreco] = useState<number>(0)
    const [Prod_custo, setCusto] = useState<number>(0)
    const [Prod_peso, setPeso] = useState<number>(0)
    const [Prod_altura, setAltura] = useState<number>(0)
    const [Prod_largura, setLargura] = useState<number>(0)
    const [Prod_comprimento, setComprimento] = useState<number>(0)
    const [Prod_marca, setMarca] = useState<string>('')
    const [Prod_modelo, setModelo] = useState<string>('')
    const [Prod_validade, setValidade] = useState<boolean>(false)
    const [Prod_quantidade, setQuantidade] = useState<number>(0)
    const [Prod_categoriaId, setCategoriaID] = useState<null>(null)
    const [Prod_unidadeId, setUnidadeID] = useState<null>(null)
    const [Prod_img, setImg] = useState<null>(null)


    const eventoFormulario = async () => {
        const novoProduto = {
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
            Prod_categoriaId,
            Prod_unidadeId,
            Prod_img
        }

        const response = await produtoServices.createProduto(novoProduto);
        if (response instanceof ApiException) {
            console.error(response.message);
        } else {
            console.log("Produto criado com sucesso:", response)
            setNome('')
            setDescricao('')
            setPreco(0)
            setCusto(0)
            setPeso(0)
            setAltura(0)
            setLargura(0)
            setComprimento(0)
            setMarca('')
            setModelo('')
            setValidade(false)
            setQuantidade(0)
            setCategoriaID(null)
            setUnidadeID(null)
            setImg(null)
            props.onSuccess('Produto criado com sucesso!') // Mensagem que será exibida na tela
        }
    }

    // Função necessária para realizar o submit utilizando a referência
    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario()
        }
    }))


    return (
        <form className="scroller">
            <div>
                {/* PARA O OTÁRIO DO FUTURO (VULGO ARTHUR): Lembrar de transformar isso tudo num único Flex Row para versão Mobile! */}
                <div className="dual rflex nwflex prod-cadastro">
                    <div className="flex2 cflex nwflex spacerChild"> {/* Coluna dupla: [1] [2] */}
                        {/* Linha: [1] */}
                        <Input className=""
                            label="Nome"
                            placeholder="Nome do produto"
                            onChange={(e) => setNome(e.target.value)}
                            value={Prod_nome}
                        />
                        {/* Linha: [2] */}
                        <div className="dual rflex nwflex">
                            <Input className="flex1"
                                label="Marca"
                                placeholder="Marca"
                                onChange={(e) => setMarca(e.target.value)}
                                value={Prod_marca}
                            />
                            <Input className="flex1"
                                label="Modelo"
                                placeholder="Modelo"
                                onChange={(e) => setModelo(e.target.value)}
                                value={Prod_modelo}
                            />
                        </div>
                        {/* Linha: [3] */}
                        <div className="dual rflex nwflex">
                            <Input className="flex1"
                                label="Custo"
                                placeholder="Custo"
                                onChange={(e) => setCusto(parseFloat(e.target.value))}
                                value={Prod_custo.toString()}
                            />
                            <Input className="flex1"
                                label="Venda"
                                placeholder="Venda"
                                onChange={(e) => setPreco(parseFloat(e.target.value))}
                                value={Prod_preco.toString()}
                            //onChange={this.obterVenda}
                            />
                        </div>
                    </div>

                    <div className="flex1 cflex nwflex spacerChild"> {/* Coluna simples: [3] */}
                        {/* Linha: [1] */}
                        {/*<Input className="flex1"
                            label="Código"
                            placeholder="Código do produto"
                            value=""
                        />*/}
                        <Input className="flex1"
                            label="Quantidade"
                            placeholder="Quantidade"
                            onChange={(e) => setQuantidade(parseInt(e.target.value))}
                            value={Prod_quantidade.toString()}
                        />
                        {/* Linha: [2] */}
                        <Input className="flex1"
                            label="Categoria"
                            type="select"
                            placeholder="Selecione..."
                            value=""
                            disabled={true}
                        />
                        {/* Linha: [3] */}
                            <div className="flex1"></div>
                        {/*
                        <Input className="flex1"
                            label="Código"
                            placeholder="Código do produto"
                            value=""
                        /> 
                        Usar este aqui após terminado como gambiarra
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
                <div className="spacerChild prod-cadastro">
                    {/* Linha: [1] */}
                    <Input className="unidadeMedida"
                        label="Unidade de Medida"
                        type="select"
                        placeholder="Selecione"
                        disabled={true}
                    />
                    {/* Linha: [2] */}
                    <div className="dual rflex nwflex">
                        <Input className="flex1"
                            label="Peso"
                            placeholder="Peso"
                            onChange={(e) => setPeso(parseFloat(e.target.value))}
                            value={Prod_peso.toString()}
                        />
                        <Input className="flex1"
                            label="Largura"
                            placeholder="Largura"
                            onChange={(e) => setCusto(parseFloat(e.target.value))}
                            value={Prod_largura.toString()}
                        />
                        <Input className="flex1"
                            label="Comprimento"
                            placeholder="Comprimento"
                            onChange={(e) => setComprimento(parseFloat(e.target.value))}
                            value={Prod_comprimento.toString()}
                        />
                        <Input className="flex1"
                            label="Altura"
                            placeholder="Altura"
                            onChange={(e) => setAltura(parseFloat(e.target.value))}
                            value={Prod_altura.toString()}
                        />
                    </div>
                    {/* Linha: [3] */}
                    <div className="radio-val">
                        <label>Possui validade?</label>
                        <label>
                            <input type="radio" name="prod_validade"
                            onChange={(e) => setValidade((e.target.value === 'true'))}
                            checked />
                                <span>Sim</span>
                        </label>
                        <label>
                            <input type="radio" name="prod_validade" />
                                <span>Não</span>
                            </label>
                    </div>
                    {/* Criar component RadioButton!! */}
                </div>
            </div>

            <div className="nextSect">
                <DivTitulo className=""
                    label="Detalhes"
                />
                <div className="spacerChild prod-cadastro">
                    {/* Linha: [1] */}
                    {/*<Input className="unidadeMedida"
                        label="Localização no estoque"
                        placeholder="Localização de armazenamento..."
                        disabled={true}
                    />*/}
                    {/* Linha: [2] */}
                    <Input className=""
                        label="Descrição"
                        placeholder="Descreva o produto..."
                        onChange={(e) => setDescricao(e.target.value)}
                        value={Prod_descricao}
                    />
                    {/* Linha: [3] */}
                    <Input className=""
                        label="Imagem do Produto"
                        type="file"
                        placeholder="<< UPLOAD >>"
                        accept="image/*"
                    //onChange={this.receberArquivo}
                    />
                </div>
            </div>
        </form>
    )

})

export default ProdutoFormulario




