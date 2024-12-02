import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { categoriaServices, Categoria } from '../../../../services/categoriaServices';
import { useAuth } from '../../../../context/AuthProvider'

interface Props {
    onSuccess: (message: string) => void;
}

const CategoriaFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const { currentUser } = useAuth();
    const [Cat_nome, setNome] = useState<string>('');
    const [Cat_status, setStatus] = useState<boolean>(true); // Status padrão como ativo
    const [Cat_pai, setCategoriaPai] = useState<number | undefined>(undefined); // Categoria pai selecionada
    const [categorias, setCategorias] = useState<Categoria[]>([]); // Lista de categorias para o select
    const [nomeError, setNomeError] = useState<boolean>(false); // Estado para o erro de campo vazio
    
    useEffect(() => {
        // Carregar todas as categorias ao inicializar o componente
        const fetchCategorias = async () => {
            const response = await categoriaServices.getAllCategoria();
            if (!(response instanceof ApiException)) {
                setCategorias(response.filter(categoria => categoria.Categoria_status === true));
            } else {
                console.error(response.message);
            }
        };
        fetchCategorias();
    }, []);

    const eventoFormulario = async () => {
        if (!Cat_nome.trim()) {
            setNomeError(true); // Mostra o erro se o campo nome estiver vazio
            return;
        }

        const novaCategoria = {
            Categoria_nome: Cat_nome,
            Categoria_status: Cat_status,
            Categoria_pai: Cat_pai,
        };

        const response = await categoriaServices.createCategoria(novaCategoria as any, currentUser?.Usuario_id!);
        if (response instanceof ApiException) {
            console.error(response.message);
        } else {
            console.log('Categoria criada com sucesso:', response);

            if (Cat_pai === undefined) {
                await categoriaServices.updateCategoria(response.Categoria_id, {
                    Categoria_id: response.Categoria_id, // Inclui Categoria_id como exigido pelo tipo Categoria
                    Categoria_nome: novaCategoria.Categoria_nome,
                    Categoria_status: novaCategoria.Categoria_status,
                    Categoria_pai: response.Categoria_id,
                },
                    currentUser?.Usuario_id
                );
            }

            setNome('');
            setCategoriaPai(undefined); // Limpar categoria pai após a criação
            props.onSuccess('Categoria criada com sucesso!');
            setNomeError(false); // Limpa o erro ao enviar com sucesso
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario();
        }
    }));

    return (
        <form>
            <div className="input-item">
                <label htmlFor="nome">Nome</label>
                <input
                    type="text"
                    value={Cat_nome}
                    onChange={(e) => {
                        setNome(e.target.value);
                        if (e.target.value.trim()) setNomeError(false); // Remove o erro ao digitar
                    }}
                    required
                    placeholder="Nome"
                />
                {nomeError && (
                    <span className="error-message">Campo obrigatório</span>
                )}
            </div>
            <div className="input-item">
                <label htmlFor="categoriaPai">Categoria Pai</label>
                <select
                    id="categoriaPai"
                    className="form-select-custom"
                    value={Cat_pai}
                    onChange={(e) => setCategoriaPai(Number(e.target.value))}
                >
                    <option value="">Selecione uma categoria pai</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.Categoria_id} value={categoria.Categoria_id}>
                            {categoria.Categoria_nome}
                        </option>
                    ))}
                </select>
            </div>

        </form>
    );
});

export default CategoriaFormulario;
