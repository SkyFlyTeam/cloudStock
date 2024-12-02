import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import {  dataProdComprado } from './data'

import "./style.css"
import { Dropdown } from "react-bootstrap";
import { BsFilter } from "react-icons/bs";
import { useEffect, useState } from "react";
import { agruparPorCategoriaQtd } from "../../utils/graph/agruparPorCategoria";
import { DadosAgrupadosQuantidade, DataQuantidade, estatisticasServices } from "../../services/estatisticasServices";
import { ApiException } from "../../config/apiException";
import { IoCloseOutline } from "react-icons/io5";

const GraficoProdEntrada: React.FC = () =>{
    const [ filter, setFilter ] = useState<'Prod_nome' | 'CategoriaPai'>('Prod_nome') 
    const [ data, setData ] = useState<Array<DataQuantidade | DadosAgrupadosQuantidade>>([]);
    const [ rawData, setRawData ] = useState<Array<DataQuantidade>>([]);

    const fetchData = async () => {
        const result = await estatisticasServices.getProdEntrada()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
          setRawData(result);
          setData(result.slice(0, 10));
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleFiltrar = (eventKey: string) => {
        if (eventKey == "1") {
            const dadosAgrupados = agruparPorCategoriaQtd(rawData).slice(0, 10)
            setData(dadosAgrupados);
            setFilter('CategoriaPai')
        }
    };

    const handleCloseFiltrar = () => {
        setFilter('Prod_nome')
        setData(rawData.slice(0, 10))
    };
      
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#975DB9', '#4FBF45', '#79C4E3', '#EB5151', '#DC5D81', '#93CC5B'];
    return (
        <>
            <div className="graph-header">
                <h4>Produtos com maior entrada </h4>
                <div className="graph-actions">
                    {filter === 'CategoriaPai' ? (<IoCloseOutline size={26} color="#61BDE0" style={{cursor: "pointer"}} onClick={() => handleCloseFiltrar()}/>): ('')}
                    <Dropdown align="end" onSelect={(eventKey) => handleFiltrar(eventKey!)}>
                        <Dropdown.Toggle
                            id="dropdown-custom-1"  
                            as="div" 
                            style={{ display: 'inline-block', cursor: 'pointer', color: '#61BDE0' }}
                        >
                            <BsFilter size={33} style={{ color: '#61BDE0'}} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="super-colors">
                            <Dropdown.Item eventKey="1">Filtrar por Categoria</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </div>
            </div>
            <ResponsiveContainer width="100%" height={600} className={"responsive-pie"}>
                <PieChart margin={{ top: 0, right: 0, left:0, bottom: 0 }} className="piechart">
                    <Pie data={data} dataKey="Quantidade" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" nameKey={filter} label={undefined}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => {
                            return `${value} un`;
                        }}/>
                    <Legend verticalAlign="bottom" align="left"  margin={{ top: 300, left: 0, right: 0, bottom: 0 }}  />
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraficoProdEntrada