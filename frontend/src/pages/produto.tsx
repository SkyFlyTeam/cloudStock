import { Component } from "react";
import { produtosServices } from "../services/produtoServices";
import { ApiException } from "../config/apiException";
import { Produto } from "../services/produtoServices";

type state = {
  // prod_cod: string
  prod_nome: string
  prod_descricao: string
  prod_preco: number
  prod_custo: number
  prod_largura: number
  unidadeMedida_id: number
  prod_img: File | null
  produtos: Produto[]
}

class Produtos extends Component<any, state> {
  constructor(props: any) {
    super(props)
    this.state = {
      // prod_cod: '',
      prod_nome: '',
      prod_descricao: '',
      prod_preco: 0,
      prod_custo: 0,
      prod_largura: 0,
      unidadeMedida_id: 1,
      prod_img: null,
      produtos: []
    }
  }

  componentDidMount() {
    produtosServices.getAllProdutos()
      .then((result) => {
        if (result instanceof ApiException) {
          alert(result.message);
        } else {
            this.setState({produtos: result})
        }
      })
  }

  eventoFormulario = async (evento: any) => {
    evento.preventDefault();
    
    const formData = new FormData();
    // const { prod_cod, prod_nome, prod_preco, prod_img } = this.state;
      const { prod_nome, prod_descricao, prod_preco, prod_img, prod_custo, prod_largura, unidadeMedida_id } = this.state;

  
    // Adicione os dados do produto
    // formData.append('Prod_cod', prod_cod);
    formData.append('Prod_nome', prod_nome);
    formData.append('Prod_descricao', prod_descricao);
    formData.append('Prod_preco', prod_preco.toString());
    formData.append('Prod_custo', prod_custo.toString());
    formData.append('Prod_largura', prod_largura.toString());
    formData.append('UnidadeMedida_id', unidadeMedida_id.toString());
    
    // Adicione o arquivo de imagem, se houver
    if (prod_img) {
      formData.append('Prod_imagem', prod_img);
    }
  
    try {
      const response = await produtosServices.createProduto(formData); 
      if (response instanceof ApiException) {
        console.error(response.message);
      } else {
        console.log("Produto criado com sucesso:", response);
        this.setState((prevState) => ({
          produtos: [...prevState.produtos, response],
          // prod_cod: '',
          prod_nome: '',
          prod_descricao: '',
          prod_preco: 0,
          prod_custo: 0,
          prod_largura: 0,
          unidadeMedida_id: 1,
          prod_img: null,
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
    this.setState({ prod_nome: evento.target.value })
  }

  obterDescricao = (evento: any) => {
    this.setState({ prod_descricao: evento.target.value })
  }

  obterPreco = (evento: any) => {
    this.setState({ prod_preco: parseFloat(evento.target.value) });
  }

  obterCusto = (evento: any) => {
    this.setState({ prod_custo: parseFloat(evento.target.value) });
  }

  obterLargura = (evento: any) => {
    this.setState({ prod_largura: parseFloat(evento.target.value) });
  }

  obterUnidade = (evento: any) => {
    this.setState({ unidadeMedida_id: parseInt(evento.target.value) });
  }

  receberArquivo = (evento: any) => {
    this.setState({ prod_img: evento.target.files[0] });
  }


  render() {
    return (
      <div className="row">
        <ul>
          {this.state.produtos.map(produto => (
            <div key={produto.Prod_cod}>
              <img src={`http://localhost:5000/produto/DownloadImage/${produto.Prod_cod}`} width={100}></img>
              <li >{produto.Prod_nome} - {produto.Prod_preco}</li>
            </div>
          ))}
        </ul>
        <form className="col s12" encType="multipart/form-data" onSubmit={this.eventoFormulario}>
          <div className="row">
            <div className="input-field col s6">
              <input value={this.state.prod_nome} onChange={this.obterNome} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Nome</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_descricao} onChange={this.obterDescricao} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Descrição</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_preco} onChange={this.obterPreco} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Preço</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_custo} onChange={this.obterCusto} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Custo</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_largura} onChange={this.obterLargura} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Largura</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.unidadeMedida_id} onChange={this.obterUnidade} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Unidade de Medida</label>
            </div>
            <div className="btn light-blue darken-4">
                <span>Arquivo</span>
                <input type="file" onChange={this.receberArquivo} accept="image/*" />
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              <button type="submit">Enviar</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Produtos;