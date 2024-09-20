import { Component } from 'react';
import Produto from '../pages/produto';
import Navbar from '../components/navbar/index';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <Produto/>
      </div>
    )
  }
}
