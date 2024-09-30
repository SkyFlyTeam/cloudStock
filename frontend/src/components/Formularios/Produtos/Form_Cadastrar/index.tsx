import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';
import { IoAddCircleOutline } from "react-icons/io5";
import Input from "../../../Input";
import DivTitulo from "../../../DivTitulo";
import BtnAzul from "../../../BtnAzul";

interface Props {
    onSuccess: (message: string) => void // Função para quando dê certo 
}

const ProdutoFormulario = forwardRef((props: Props, ref: Ref<{
    submitForm: () => void
}>) => {
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
    const [Prod_imagem, setImg] = useState<File | null>(null)

    const eventoFormulario = async () => {
        const formData = new FormData();
        
        // Adicione os dados do produto
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
        formData.append('Prod_validade', Prod_validade ? 'true' : 'false');
        formData.append('Prod_quantidade', Prod_quantidade.toString());

        // Adicione o arquivo de imagem, se houver
        if (Prod_imagem) {
            formData.append('Prod_imagem', Prod_imagem);
        }

        const response = await produtoServices.createProduto(formData); 
        if (response instanceof ApiException) {
            console.error(response.message);
        } else {
            console.log("Produto criado com sucesso:", response);
            // Resetar os campos
            setNome('');
            setDescricao('');
            setPreco(0);
            setCusto(0);
            setPeso(0);
            setAltura(0);
            setLargura(0);
            setComprimento(0);
            setMarca('');
            setModelo('');
            setValidade(false);
            setQuantidade(0);
            setCategoriaID(null);
            setUnidadeID(null);
            setImg(null);
            props.onSuccess('Produto criado com sucesso!');
        }
    }

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario();
        }
    }))

    return (
        <form className="scroller" encType="multipart/form-data">
            <div className="dual rflex nwflex prod-cadastro">
                <div className="flex2 cflex nwflex spacerChild">
                    <Input label="Nome" placeholder="Nome do produto" onChange={(e) => setNome(e.target.value)} value={Prod_nome} />
                    <Input label="Marca" placeholder="Marca" onChange={(e) => setMarca(e.target.value)} value={Prod_marca} />
                    <Input label="Modelo" placeholder="Modelo" onChange={(e) => setModelo(e.target.value)} value={Prod_modelo} />
                    <Input label="Custo" placeholder="Custo" onChange={(e) => setCusto(parseFloat(e.target.value))} value={Prod_custo.toString()} />
                    <Input label="Venda" placeholder="Venda" onChange={(e) => setPreco(parseFloat(e.target.value))} value={Prod_preco.toString()} />
                </div>
                <div className="flex1 cflex nwflex spacerChild">
                    <Input label="Categoria" type="select" placeholder="Selecione..." value="" disabled={true} />
                    <Input label="Quantidade" placeholder="Quantidade" onChange={(e) => setQuantidade(parseInt(e.target.value))} value={Prod_quantidade.toString()} />
                </div>
            </div>

            <div className="nextSect">
                <DivTitulo label="Especificações" />
                <Input label="Peso" placeholder="Peso" onChange={(e) => setPeso(parseFloat(e.target.value))} value={Prod_peso.toString()} />
                <Input label="Largura" placeholder="Largura" onChange={(e) => setLargura(parseFloat(e.target.value))} value={Prod_largura.toString()} />
                <Input label="Comprimento" placeholder="Comprimento" onChange={(e) => setComprimento(parseFloat(e.target.value))} value={Prod_comprimento.toString()} />
                <Input label="Altura" placeholder="Altura" onChange={(e) => setAltura(parseFloat(e.target.value))} value={Prod_altura.toString()} />
                <div className="input-radio">
                    <label>Possui validade?</label>
                    <div className="radio-option">
                        <input type="radio" name="prod_validade" onChange={(e) => setValidade(e.target.value === 'true')} />
                        <label>Sim</label>
                    </div>
                    <div className="radio-option">
                        <input type="radio" name="prod_validade" defaultChecked />
                        <label>Não</label>
                    </div>
                </div>
            </div>

            <div className="nextSect">
                <DivTitulo className=""
                        label="Detalhes"
                    />
                    <Input className=""
                        label="Descrição"
                        placeholder="Descreva o produto..."
                        onChange={(e) => setDescricao(e.target.value)}
                        value={Prod_descricao}
                    />
                    {/* Linha: [3] */}
                <input type="file" onChange={(e) => e.target.files && setImg(e.target.files[0])} accept="image/*" />
            </div>
        </form>
    )
})

export default ProdutoFormulario;
