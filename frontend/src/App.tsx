import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Elementos from './components/elementos';

function App() {
  const [data, setData] = useState<string>();

  useEffect(() => {
    // Fazendo a requisição para o back-end e definindo os dados no estado
    fetch('http://localhost:5000/')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>{data}</h1>
    </div>
  );
}

export default App;
