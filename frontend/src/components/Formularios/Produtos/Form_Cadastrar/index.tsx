import { useState, forwardRef, useImperativeHandle, Ref, useEffect } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';
import { IoAddCircleOutline } from "react-icons/io5";
import Input from "../../../Input";
import DivTitulo from "../../../DivTitulo";
import BtnAzul from "../../../BtnAzul";
import { Unidade_Medida, unidadeService } from '../../../../services/unidadeMedidaService'

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
    const [UnidadeMedida_id, setUnidadeMedida_id] = useState<number>(0)
    const [Prod_imagem, setImg] = useState<File | null>(null)
    const [unidades, setUnidades] = useState<Unidade_Medida[]>([])

    useEffect(() => {
        const fetchUnidades = async () => {
            const result = await unidadeService.getAllUnidadeMedida();
            if (result instanceof ApiException) {
                console.error(result.message);
            } else {
                setUnidades(result);
            }
        };
        fetchUnidades();
    }, []);

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
        formData.append('UnidadeMedida_id', UnidadeMedida_id.toString())

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
            setImg(null);
            setUnidadeMedida_id(0)
            props.onSuccess('Produto criado com sucesso!');
        }
    }

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario();
        }
    }))

    return (

        <form className="form-prod" encType="multipart/form-data">
            <section className="form-prod">
                <div className="input-group-prod">
                    <Input 
                        className="input-item-prod large"
                        label="Nome"
                        placeholder="Nome do produto"
                        onChange={(e) => setNome(e.target.value)}
                        value={Prod_nome}
                    />
                </div>
                <div className="input-group-prod">
                    <Input className="input-item-prod"
                        label="Marca"
                        placeholder="Marca"
                        onChange={(e) => setMarca(e.target.value)}
                        value={Prod_marca}
                    />
                    <Input className="input-item-prod"
                        label="Modelo"
                        placeholder="Modelo"
                        onChange={(e) => setModelo(e.target.value)}
                        value={Prod_modelo}
                    />
                </div>
                <div className="input-group-prod">
                    <Input className="input-item-prod"
                        label="Custo"
                        placeholder="Custo"
                        onChange={(e) => setCusto(parseFloat(e.target.value))}
                        value={Prod_custo.toString()}
                    />
                    <Input className="input-item-prod"
                        label="Venda"
                        placeholder="Venda"
                        onChange={(e) => setPreco(parseFloat(e.target.value))}
                        value={Prod_preco.toString()}
                    />
                </div>
            </section>
            <div className='subtitle-form-prod'>
                <span>Especificações</span>
                <hr className="line"/>
            </div>
            <section className='form-prod'>
                <div className="input-item-prod">
                    <label>Unidade de Medida</label>
                    <select 
                        className="form-select-custom"
                        value={UnidadeMedida_id}
                        onChange={(e) => setUnidadeMedida_id(+e.target.value)}
                    >
                        <option value="">Selecionar...</option>
                        {unidades.map((unidade) => (
                            <option key={unidade.UnidadeMedida_id} value={unidade.UnidadeMedida_id}>
                                {unidade.UnidadeMedida_nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group-prod">
                    <Input className="input-item-prod"
                        label="Peso"
                        placeholder="Peso"
                        onChange={(e) => setPeso(parseFloat(e.target.value))}
                        value={Prod_peso.toString()}
                    />
                    <Input className="input-item-prod"
                        label="Largura"
                        placeholder="Largura"
                        onChange={(e) => setLargura(parseFloat(e.target.value))}
                        value={Prod_largura.toString()}
                    />
                </div>
                <div className="input-group-prod">
                    <Input className="input-item-prod"
                        label="Comprimento"
                        placeholder="Comprimento"
                        onChange={(e) => setComprimento(parseFloat(e.target.value))}
                        value={Prod_comprimento.toString()}
                    />
                    <Input className="input-item-prod"
                        label="Altura"
                        placeholder="Altura"
                        onChange={(e) => setAltura(parseFloat(e.target.value))}
                        value={Prod_altura.toString()}
                    />
                </div>
            </section>
            <div className='subtitle-form-prod'>
                <span>Detalhes</span>
                <hr className="line"/>
            </div>
            <section className='form-prod'>
                <div className="input-group-prod">
                    <Input className="input-item-prod large"
                        label="Descrição"
                        placeholder="Descreva o produto..."
                        onChange={(e) => setDescricao(e.target.value)}
                        value={Prod_descricao}
                    />
                </div>
                <div className="input-group-prod">
                    <input className="input-item-prod large"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImg(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            </section>
        </form>
    )
})

export default ProdutoFormulario;
