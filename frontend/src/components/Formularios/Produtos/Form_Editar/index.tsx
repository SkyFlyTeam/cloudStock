import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';
//
import Input from "../../../Input";
import DivTitulo from "../../../DivTitulo";

import './style.css'
import { useAuth } from '../../../../context/AuthProvider';

interface Props {
    id: number
    onSuccess: (message: string) => void

}

const ProdutoEditar = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const {currentUser} = useAuth();
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
    const [Prod_imagem, setImg] = useState<File | null>(null)
    const [Prod_estoqueMinimo, setEstoqueMinimo] = useState<number>(0); // Novo campo para estoque mínimo

    const eventoFormulario = async () => {
        const formData = new FormData();

        // Adicione verificações para os valores
    formData.append('Prod_nome', Prod_nome || '');
    formData.append('Prod_descricao', Prod_descricao || '');
    formData.append('Prod_preco', Prod_preco !== undefined ? Prod_preco.toString() : '0');
    formData.append('Prod_custo', Prod_custo !== undefined ? Prod_custo.toString() : '0');
    formData.append('Prod_peso', Prod_peso !== undefined ? Prod_peso.toString() : '0');
    formData.append('Prod_altura', Prod_altura !== undefined ? Prod_altura.toString() : '0');
    formData.append('Prod_largura', Prod_largura !== undefined ? Prod_largura.toString() : '0');
    formData.append('Prod_comprimento', Prod_comprimento !== undefined ? Prod_comprimento.toString() : '0');
    formData.append('Prod_marca', Prod_marca || '');
    formData.append('Prod_modelo', Prod_modelo || '');
    formData.append('Prod_validade', Prod_validade ? 'true' : 'false');
    formData.append('Prod_quantidade', Prod_quantidade !== undefined ? Prod_quantidade.toString() : '0');
    formData.append('Prod_estoqueMinimo',Prod_estoqueMinimo !== undefined ? Prod_estoqueMinimo.toString() : '0');// Envio do estoque mínimo

        // Adicione o arquivo de imagem, se houver
        if (Prod_imagem) {
            formData.append('Prod_imagem', Prod_imagem);
        }

        // Envia o id como parâmetro e as informações atualizdas
        const response = await produtoServices.updateProduto(props.id, formData)
        if (response instanceof ApiException) {
            console.error(response.message)
        } else {
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
            setEstoqueMinimo(0); // Reset estoque mínimo
            props.onSuccess('Produto atualizado com sucesso!');
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
                console.log(result)
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
                setEstoqueMinimo(result.Prod_estoqueMinimo); // Configuração do estoque mínimo
            }
        };

        fetchProduto()
    }, []);

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
                {/* Outros campos aqui */}

                {currentUser?.Cargo_id === 2 && (
    <div className="input-group-prod">
        <Input 
            className="input-item-prod"
            label="Estoque Mínimo"
            placeholder="Digite o estoque mínimo"
            onChange={(e) => setEstoqueMinimo(parseInt(e.target.value))}
            value={Prod_estoqueMinimo.toString()}
        />
    </div>
)}
            </section>
            <div className='subtitle-form-prod'>
                <span>Especificações</span>
                <hr className="line"/>
            </div>
            <section className='form-prod'>
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

export default ProdutoEditar;
