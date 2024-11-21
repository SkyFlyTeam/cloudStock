import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import {  dataMaiorRent } from './data'

const GraficoProdRentabilidade: React.FC = () =>{
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#975DB9', '#4FBF45', '#79C4E3', '#EB5151', '#DC5D81', '#93CC5B'];
    return (
        <>
            <div className="graph-header">
                <h4>Produtos com maior rentabilidade </h4>
            </div>
            <ResponsiveContainer width="100%" height={520} className={"responsive-pie"}>
                <PieChart  margin={{ top: 0, right: 0, left:0, bottom: 0 }}>
                    <Pie data={dataMaiorRent} dataKey="ValorTot" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" nameKey="Prod_nome" label>
                    {dataMaiorRent.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => {
                            if (typeof value === 'number') {
                            return new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            }).format(value);
                            }
                            return value;
                        }}
                        />
                    <Legend verticalAlign="bottom" align="left"  margin={{ top: 100, left: 0, right: 0, bottom: 0 }}  />
                </PieChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraficoProdRentabilidade