import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';
//
import Input from "../../../Input";
import DivTitulo from "../../../DivTitulo";

interface Props {
    id: number
    onSuccess: (message: string) => void
}

const ProdutoEditar = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
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
    const [Categoria_Id, setCategoriaID] = useState<null>(null)
    const [UnidadeMedida_id, setUnidadeID] = useState<null>(null)
    //const [Prod_imagem, setImg] = useState<File | null>(null)

    const eventoFormulario = async () => {
        const produtoAtualizado = {
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
            Categoria_Id,
            UnidadeMedida_id
            //UnidadeMedida_id,
            //Prod_imagem
        }

        // Envia o id como parâmetro e as informações atualizdas
        const response = await produtoServices.updateProduto(props.id, produtoAtualizado)
        if (response instanceof ApiException) {
            console.log("Form_Editar:")
            console.log(props.id)
            console.log(produtoAtualizado)
            console.error(response.message)
        } else {
            console.log("Produto atualizado com sucesso:", response)
            props.onSuccess('Produto atualizado com sucesso!')
        }
    }

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario()
        }
    }))

    // Preenche o formulário com as informações
    useEffect(() => {
        const fetchProduto = async () => {
            const result = await produtoServices.getProdutoByID(props.id)
            if (result instanceof ApiException) {
                alert(result.message)
            } else {
                setNome(result.Prod_nome)
                setDescricao(result.Prod_descricao)
                setPreco(result.Prod_preco)
                setCusto(result.Prod_custo)
                setPeso(result.Prod_peso)
                setAltura(result.Prod_altura)
                setLargura(result.Prod_largura)
                setComprimento(result.Prod_comprimento)
                setMarca(result.Prod_marca)
                setModelo(result.Prod_modelo)
                setValidade(result.Prod_validade)
                setQuantidade(result.Prod_quantidade)
                setCategoriaID(result.Categoria_id)
                setUnidadeID(result.UnidadeMedida_id)
                //setImg(result.Prod_imagem)
            }
        };

        fetchProduto()
    }, []);

    return (

        <form className="scroller" encType="multipart/form-data">
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
                            label="Categoria"
                            type="select"
                            placeholder="Selecione..."
                            value=""
                            disabled={true}
                        />

                        {/* Linha: [2] */}
                        <Input className="flex1"
                            label="Quantidade"
                            placeholder="Quantidade"
                            onChange={(e) => setQuantidade(parseInt(e.target.value))}
                            value={Prod_quantidade.toString()}
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
                            onChange={(e) => setLargura(parseFloat(e.target.value))}
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
                            />
                            <span>Sim</span>
                        </label>
                        <label>
                            <input type="radio" name="prod_validade" defaultChecked />
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
                    {/*
                    <input className=""
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImg(e.target.files[0]);
                            }
                        }}
                        disabled={true}
                    //onChange={(e) => setImg((e.target as HTMLInputElement)?.files[0])}
                    />*/}
                </div>
            </div>
        </form>
    )
})

export default ProdutoEditar;
