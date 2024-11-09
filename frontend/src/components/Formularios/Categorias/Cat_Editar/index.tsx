import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { categoriaServices } from '../../../../services/categoriaServices';

interface Props {
  id: number;
  onSuccess: (message: string) => void;
}

const CategoriaEdicao = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Cat_nome, setNome] = useState<string>('');
  const [Cat_status, setStatus] = useState<boolean>(true);
  const [categoriasPais, setCategoriasPais] = useState<any[]>([]);
  const [Categoria_pai, setCategoriaPai] = useState<number | null>(null);
  const [nomeError, setNomeError] = useState<boolean>(false);

  // Estados para armazenar valores iniciais
  const [initialNome, setInitialNome] = useState<string>('');
  const [initialStatus, setInitialStatus] = useState<boolean>(true);
  const [initialCategoriaPai, setInitialCategoriaPai] = useState<number | null>(null);

  // Função para buscar categorias pai
  const fetchCategoriasPais = async () => {
    const result = await categoriaServices.getAllCategoria();
    if (result instanceof ApiException) {
      console.error(result.message);
    } else {
      setCategoriasPais(result);
    }
  };

  // Função para enviar a atualização da categoria
  const eventoFormulario = async () => {
    if (!Cat_nome.trim()) {
      setNomeError(true);
      return;
    }

    // Verifica se houve alterações antes de salvar
    if (
      Cat_nome === initialNome &&
      Cat_status === initialStatus &&
      Categoria_pai === initialCategoriaPai
    ) {
      return;
    }

    const categoriaAtualizada = {
      Categoria_nome: Cat_nome,
      Categoria_status: Cat_status,
      Categoria_pai: Categoria_pai,
    };

    const response = await categoriaServices.updateCategoria(props.id, categoriaAtualizada as any);
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      console.log("Categoria atualizada com sucesso:", response);
      props.onSuccess('Categoria atualizada com sucesso!');
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario();
    }
  }));

  useEffect(() => {
    const fetchCategoria = async () => {
      const result = await categoriaServices.getCategoriaByID(props.id);
      if (result instanceof ApiException) {
        alert(result.message);
      } else {
        setNome(result.Categoria_nome);
        setStatus(result.Categoria_status);
        setCategoriaPai(result.Categoria_pai ?? 1);

        // Armazena os valores iniciais para comparação
        setInitialNome(result.Categoria_nome);
        setInitialStatus(result.Categoria_status);
        setInitialCategoriaPai(result.Categoria_pai ?? 1);
      }
    };

    fetchCategoria();
    fetchCategoriasPais();
  }, [props.id]);

  return (
    <form>
      <div className="input-item">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          value={Cat_nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (e.target.value.trim()) setNomeError(false);
          }}
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
          value={Categoria_pai || ''}
          onChange={(e) => setCategoriaPai(Number(e.target.value))}
        >
          <option value="">Nenhuma</option>
          {categoriasPais.map(categoria => (
            <option key={categoria.Categoria_id} value={categoria.Categoria_id}>
              {categoria.Categoria_nome}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
});

export default CategoriaEdicao;
