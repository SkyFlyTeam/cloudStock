import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { dataEntSaida } from './data'

import { BsFilter } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi";
import { useEffect, useState } from "react"
import { agruparEntrSaidaPorMes, agruparLucroGastos } from "../../utils/graph/agruparPorMes"

import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import ptBR from 'rsuite/locales/pt_BR';

import moment from 'moment'
import 'moment/locale/pt-br';
import { IoCalendar } from "react-icons/io5";
import { Dropdown } from "react-bootstrap";
import { DataEntrSaida, estatisticasServices } from "../../services/estatisticasServices";
import { ApiException } from "../../config/apiException";
import { filtrarDadosPorPeriodo } from "../../utils/graph/filtrarPorPeriodo";
moment.locale('pt-br');

const GraficoEntrSaida: React.FC = () =>{
    const [ rawData, setRawData ] = useState<DataEntrSaida[]>();
    const [ data, setData ] = useState<DataEntrSaida[]>();
    const [ filter, setFilter ] = useState<'none' | 'intervalo'>('none') 
    const [ showDatePicker, setShowDatePicker ] = useState<boolean>(false) 

    const fetchData = async () => {
        const result = await estatisticasServices.getEntradaSaida()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
            setRawData(result)
            const dadosAgrupadosPorMes = agruparEntrSaidaPorMes(result)
            setData(dadosAgrupadosPorMes);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDateChange = (range: any) => {
        if (!range) {
            const dadosAgrupadosPorMes = agruparEntrSaidaPorMes(rawData!);
            setData(dadosAgrupadosPorMes);
            return;
        }
    
        const [start, end] = range;
    
        const filtered = filtrarDadosPorPeriodo(rawData!, start, end)
    
        setFilter('intervalo');
        setData(filtered);
    };
    
    
    const handleRemoveDateFilter = () => {
        const dadosAgrupadosPorMes = agruparEntrSaidaPorMes(rawData!)
        setData(dadosAgrupadosPorMes)
        setFilter('none')
        setShowDatePicker(false)
    }

    return (
        <>
            <div className="graph-header">
                <h4>Entradas e saídas</h4>
                <div className="graph-actions">
                    {showDatePicker ? (
                        <DateRangePicker
                        format="dd-MM-yyyy" 
                        onChange={handleDateChange} 
                        placeholder="Selecione um intervalo"
                        onClean={handleRemoveDateFilter}
                        size="md"
                        showHeader={false}
                        caretAs={IoCalendar}
                        locale={ptBR.DateRangePicker}
                        placement="bottomEnd"
                        />
                    ): (
                        <IoCalendar size={22} style={{ color: '#61BDE0'}} onClick={() => setShowDatePicker(true)}/>
                    )}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}
                    margin={{ top: 0, right: 0, left:30, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c800001c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#c800001c" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ebf1a2c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ebf1a2c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={(tick) => {
                        if(filter === 'intervalo'){
                            return moment(tick, 'YYYY-MM-DD').format('DD/MM')
                        } else if(filter === 'none'){
                            return moment(tick, 'YYYY-MM').format('MMM')
                        }
                        return tick
                    }
                    }/>
                    <YAxis  domain={[0, 'dataMax + 2000']} label={{ value: 'Valor total (R$)', angle: -90, position: 'insideLeft', dx: -30, dy: 40 }}/>
                    <CartesianGrid strokeDasharray="3 3" />
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

                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" name="Entradas" dataKey="entrada" stroke="#C80000" fillOpacity={1} fill="url(#colorEntrada)" />
                    <Area type="monotone" name="Saídas" dataKey="saida" stroke="#4FBF1A" fillOpacity={1} fill="url(#colorSaida)" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraficoEntrSaida