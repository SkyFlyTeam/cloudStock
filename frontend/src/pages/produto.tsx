import { Component } from "react";
import { produtosServices } from "../services/produtoServices";
import { ApiException } from "../config/apiException";
import { Produto } from "../services/produtoServices";

type state = {
  // prod_cod: string
  Prod_nome: string
  Prod_descricao: string
  Prod_preco: number
  Prod_custo: number
  Prod_largura: number
  UnidadeMedida_id: number
  Prod_img: File | null
  Produtos: Produto[]
}

class Products extends Component<any, state> {
  constructor(props: any) {
    super(props)
    this.state = {
      // prod_cod: '',
      Prod_nome: '',
      Prod_descricao: '',
      Prod_preco: 0,
      Prod_custo: 0,
      Prod_largura: 0,
      UnidadeMedida_id: 1,
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
            this.setState({Produtos: result})
        }
      })
  }

  eventoFormulario = async (evento: any) => {
    evento.preventDefault();
    
    const formData = new FormData();
    // const { prod_cod, prod_nome, P, prod_img } = this.state;
      const { Prod_nome, Prod_descricao, Prod_preco, Prod_img, Prod_custo, Prod_largura, UnidadeMedida_id } = this.state;

  
    // Adicione os dados do produto
    // formData.append('Prod_cod', prod_cod);
    formData.append('Prod_nome', Prod_nome);
    formData.append('Prod_descricao', Prod_descricao);
    formData.append('Prod_preco', Prod_preco.toString());
    formData.append('Prod_custo', Prod_custo.toString());
    formData.append('Prod_largura', Prod_largura.toString());
    
    
    // Adicione o arquivo de imagem, se houver
    if (Prod_img) {
      formData.append('Prod_imagem', Prod_img);
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
          Prod_largura: 0,
          UnidadeMedida_id: 1,
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

  obterPreco = (evento: any) => {
    this.setState({ Prod_preco: parseFloat(evento.target.value) });
  }

  obterCusto = (evento: any) => {
    this.setState({ Prod_custo: parseFloat(evento.target.value) });
  }

  obterLargura = (evento: any) => {
    this.setState({ Prod_largura: parseFloat(evento.target.value) });
  }

  obterUnidade = (evento: any) => {
    this.setState({ UnidadeMedida_id: parseInt(evento.target.value) });
  }

  receberArquivo = (evento: any) => {
    this.setState({ Prod_img: evento.target.files[0] });
  }


  render() {
    return (
      <div className="row">
        <ul>
          {this.state.Produtos.map(produto => (
            <div key={produto.Prod_cod}>
              <img src={`http://localhost:5000/produto/DownloadImage/${produto.Prod_cod}`} width={100}></img>
              <li >{produto.Prod_nome} - {produto.Prod_preco}</li>
            </div>
          ))}
        </ul>
        <form className="col s12" encType="multipart/form-data" onSubmit={this.eventoFormulario}>
          <div className="row">
            <div className="input-field col s6">
              <input value={this.state.Prod_nome} onChange={this.obterNome} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Nome</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.Prod_descricao} onChange={this.obterDescricao} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Descrição</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.Prod_preco} onChange={this.obterPreco} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Preço</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.Prod_custo} onChange={this.obterCusto} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Custo</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.Prod_largura} onChange={this.obterLargura} id="last_name" type="number" className="validate" />
              <label htmlFor="last_name">Largura</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.UnidadeMedida_id} onChange={this.obterUnidade} id="last_name" type="text" className="validate" />
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

export default Products;