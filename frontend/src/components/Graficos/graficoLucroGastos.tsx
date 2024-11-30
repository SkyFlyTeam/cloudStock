import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts"
import { dataPerdaLucro } from './data'

import { BsFilter } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi";
import { useEffect, useState } from "react"
import { agruparLucroGastos } from "../../utils/graph/agruparPorMes"

import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import ptBR from 'rsuite/locales/pt_BR';

import moment from 'moment'
import 'moment/locale/pt-br';
import { IoCalendar } from "react-icons/io5";
import { ApiException } from "../../config/apiException";
import { DataLucroGastos, estatisticasServices } from "../../services/estatisticasServices";
import { filtrarDadosPorPeriodo } from "../../utils/graph/filtrarPorPeriodo";
moment.locale('pt-br');

const GanhosGastosTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, ganhos, gastos, lucro } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{moment(date).format('DD/MM/YYYY')}</p>
          <p style={{color: '#C80000'}}>Gastos: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(gastos)}</p>
          <p style={{color: '#4FBF1A'}}>Ganhos: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(ganhos)}</p>
          <p style={{color: '#F8BA36'}}>Lucro: {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(lucro)}</p>
        </div>
      );
    }
  
    return null;
};

const GraficoLucroGastos: React.FC = () =>{
    const [ rawData, setRawData ] = useState<DataLucroGastos[]>();
    const [ data, setData ] = useState<DataLucroGastos[]>();
    const [ filter, setFilter ] = useState<'none' | 'intervalo'>('none') 
    const [ showDatePicker, setShowDatePicker ] = useState<boolean>(false) 

    const fetchData = async () => {
        const result = await estatisticasServices.getLucroGastos()
        if (result instanceof ApiException) {
          console.log(result.message)
        } else {
            setRawData(result)
            const dadosAgrupadosPorMes = agruparLucroGastos(result)
            setData(dadosAgrupadosPorMes);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDateChange = (range: any) => {
        if (!range) {
            const dadosAgrupadosPorMes = agruparLucroGastos(rawData!);
            setData(dadosAgrupadosPorMes);
            return;
        }
    
        const [start, end] = range;
    
        const filtered = filtrarDadosPorPeriodo(rawData!, start, end)
    
        setFilter('intervalo');
        setData(filtered);
    };
    
    
      const handleRemoveDateFilter = () => {
        const dadosAgrupadosPorMes = agruparLucroGastos(rawData!)
        setData(dadosAgrupadosPorMes)
        setFilter('none')
        setShowDatePicker(false)
      }

    return (
        <>
            <div className="graph-header">
                <h4>Ganhos x Gastos</h4>
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
                    <Tooltip content={<GanhosGastosTooltip />} />
                    <Legend verticalAlign="top" height={36}/>
                    <Area type="monotone" name="Gastos" dataKey="gastos" stroke="#C80000" fillOpacity={1} fill="url(#colorEntrada)" />
                    <Area type="monotone" name="Ganhos" dataKey="ganhos" stroke="#4FBF1A" fillOpacity={1} fill="url(#colorSaida)" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraficoLucroGastos