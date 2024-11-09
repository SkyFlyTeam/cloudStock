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
  const [categoriasPais, setCategoriasPais] = useState<any[]>([]); // Estado para categorias pais
  const [Categoria_pai, setCategoriaPai] = useState<number | null>(null); // Estado para categoria pai selecionada

  // Função para buscar categorias pai
  const fetchCategoriasPais = async () => {
    const result = await categoriaServices.getAllCategoria();
    if (result instanceof ApiException) {
      console.error(result.message);
    } else {
      setCategoriasPais(result.filter(categoria => categoria.Categoria_status === true));
    }
  };

  // Função para enviar a atualização da categoria
  const eventoFormulario = async () => {
    const categoriaAtualizada = {
      Categoria_nome: Cat_nome,
      Categoria_status: Cat_status,
      Categoria_pai: Categoria_pai,
      // Inclua outros campos conforme necessário
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
        alert(result.message) 
      } else {
        setNome(result.Categoria_nome);
        setStatus(result.Categoria_status);
        setCategoriaPai(result.Categoria_pai ?? 1);
      }
    };

    fetchCategoria();
    fetchCategoriasPais(); // Busca as categorias pais
  }, [props.id]);


  return (
    <form>
      <div className="input-item">
        <label htmlFor="nome">Nome</label>
        <input type="text" value={Cat_nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div className="input-item">
        <label htmlFor="categoriaPai">Categoria Pai</label>
        <select
          id="categoriaPai"
          className="form-select-custom"  // Adicionando a classe de estilo aqui
          value={Categoria_pai || ''}  // Verifica se existe um valor para Categoria_pai, caso contrário, atribui ''
          onChange={(e) => setCategoriaPai(Number(e.target.value))}
        >
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
