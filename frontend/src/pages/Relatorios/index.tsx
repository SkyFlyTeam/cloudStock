import { useState, useEffect } from 'react'
import GraficoEntrSaida from '../../components/Graficos/graficoEntrSaida'
import GraficoLucroGastos from '../../components/Graficos/graficoLucroGastos'
import GraficoPerdas from '../../components/Graficos/graficoPerdas'
import GraficoProdCusto from '../../components/Graficos/graficoProdCusto'
import GraficoProdEntrada from '../../components/Graficos/graficoProdEntrada'
import GraficoProdRentabilidade from '../../components/Graficos/graficoProdRentabilidade'
import GraficoProdSaida from '../../components/Graficos/graficoProdSaida'
import { ApiException } from '../../config/apiException'
import { DataEstGeral, estatisticasServices } from '../../services/estatisticasServices'
import { agruparEntrSaidaPorMes } from '../../utils/graph/agruparPorMes'
import './style.css'

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

function Relatorios() {
    // const [ estGeral, setEstGeral ] = useState<DataEstGeral>();

    // const fetchEstatiscasGerais = async () => {
    //     const result = await estatisticasServices.getEstGeral()
    //     if (result instanceof ApiException) {
    //       console.log(result.message)
    //     } else {
    //         setEstGeral(result)
    //     }
    // }

    // useEffect(() => {
    //     fetchEstatiscasGerais()
    // }, [])

    return(
        <main className="relatorios">
            <div className="page-title">
                <h1 className="title">Relatórios</h1>
                <hr className="line" />
            </div>

            <div className="container-grid">
                <div className="stats">
                    <div className="card-stats positive">
                        <span>Total de produtos</span>
                        <h1>234</h1>
                    </div>
                    <div className="card-stats negative">
                        <span>Produtos com estoque mínimo</span>
                        <h1>12</h1>
                    </div>
                    <div className="card-stats danger">
                        <span>Produtos com validade próxima</span>
                        <h1>22</h1>
                    </div>
                </div>
                <div className="row2">
                    <div className="graph-card">
                        <GraficoEntrSaida/>
                    </div>
                    <div className="graph-card finance-stats">
                    <div className="finance-stat">
                            <span>Total gasto em entradas</span>
                            <div className="finance-quantity">
                                <FaArrowTrendDown color="#C80000" size={50} />
                                <h1>R$ 22.000</h1>
                            </div>
                        </div>
                        <div className="finance-stat">
                            <span>Total ganho em saídas</span>
                            <div className="finance-quantity">
                                <FaArrowTrendUp color="#61BDE0" size={50} />
                                <h1>R$ 22.000</h1>
                            </div>
                        </div>
                        <div className="finance-stat">
                            <span>Lucro Total</span>
                            <div className="finance-quantity">
                                <FaArrowTrendUp color="#4FBF1A" size={50} />
                                <h1>R$ 22.000</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row3">
                    <div className="graph-card">
                        <GraficoProdEntrada/>
                    </div>
                    <div className="graph-card">
                        <GraficoProdSaida/>
                    </div>
                </div>
                <div>
                    <div className="graph-card">
                        <GraficoLucroGastos />
                    </div>
                </div>
                <div>
                    <div className="graph-card">
                        <GraficoPerdas />
                    </div>
                </div>
                <div className="row3">
                    <div className="graph-card">
                        <GraficoProdRentabilidade />
                    </div>
                    <div className="graph-card">
                        <GraficoProdCusto />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Relatorios