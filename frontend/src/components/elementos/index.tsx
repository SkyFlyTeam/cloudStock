import { useEffect, useState } from 'react';

interface Fornecedor {
    pro_nome: string,
    pro_valor: number,
    func_nome: string
  }

function Elementos(){
    const [data, setData] = useState<Fornecedor[]>([]);

    useEffect(() => {
      // Fazendo a requisição para o back-end e definindo os dados no estado
      fetch('http://localhost:5000/elementos')
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));
    }, []);
    return(
        <div>
            <h1>Dados do Back-End</h1>
            <table>
            <thead>
                <tr>
                <th>Fornecedor</th>
                <th>Nome</th>
                <th>Preço</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr>
                    <td>{item.func_nome}</td>
                    <td>{item.pro_nome}</td>
                    <td>{item.pro_valor}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    )
}

export default Elementos;   
