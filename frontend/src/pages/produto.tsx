import { Component } from "react";
import { produtosServices } from "../services/produtoServices";
import { ApiException } from "../config/apiException";
import { Produto } from "../services/produtoServices";

type state = {
  prod_cod: string
  prod_nome: string
  prod_preco: number
  produtos: Produto[]
}

class Produtos extends Component<any, state> {
  constructor(props: any) {
    super(props)
    this.state = {
      prod_cod: '',
      prod_nome: '',
      prod_preco: 0,
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
    evento.preventDefault()
    
    const { prod_cod, prod_nome, prod_preco} = this.state;

    const novoProduto = {
      prod_cod,
      prod_nome,
      prod_preco,
    };

    const response = await produtosServices.createProduto(novoProduto);
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      console.log("Produto criado com sucesso:", response);
      this.setState((prevState) => ({
        produtos: [...prevState.produtos, response],
        prod_cod: '',
        prod_nome: '',
        prod_preco: 0,
      }));
    }
  }

  obterCodigo = (evento: any) => {
    this.setState({ prod_cod: evento.target.value })
  }

  obterNome = (evento: any) => {
    this.setState({ prod_nome: evento.target.value })
  }

  obterPreco = (evento: any) => {
    this.setState({ prod_preco: parseFloat(evento.target.value) });
  }


  render() {
    return (
      <div className="row">
        <ul>
          {this.state.produtos.map(produto => (
            <li key={produto.prod_cod}>{produto.prod_nome} - {produto.prod_preco}</li>
          ))}
        </ul>
        <form className="col s12" onSubmit={this.eventoFormulario}>
          <div className="row">
            <div className="input-field col s6">
              <input value={this.state.prod_cod} onChange={this.obterCodigo} id="first_name" type="text" className="validate" />
              <label htmlFor="first_name">Código</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_nome} onChange={this.obterNome} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Nome</label>
            </div>
            <div className="input-field col s6">
              <input value={this.state.prod_preco} onChange={this.obterPreco} id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Preço</label>
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