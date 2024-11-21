import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { dataPerdaLucro } from './data'

import { BsFilter } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi";
import { useState } from "react"
import { agruparLucroPerda } from "../../utils/graph/agruparPorMes"

import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import ptBR from 'rsuite/locales/pt_BR';

import moment from 'moment'
import 'moment/locale/pt-br';
import { IoCalendar } from "react-icons/io5";
moment.locale('pt-br');

const GraficoLucroPerda: React.FC = () =>{
    const [dadosEntrSaida, setDadosEntrSaida] = useState(agruparLucroPerda(dataPerdaLucro));
    const [ filter, setFilter ] = useState<'none' | 'intervalo' | 'quantidade'>('none') 
    const [ showDatePicker, setShowDatePicker ] = useState<boolean>(false) 

    const handleDateChange = (range: any) => {
        if (!range) {
            setDadosEntrSaida(agruparLucroPerda(dataPerdaLucro)); // Resetar os dados caso nenhuma data seja selecionada
            return;
        }
    
        const [start, end] = range;
        const filtered = dataPerdaLucro.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= start && itemDate <= end;
        });
        
        setFilter('intervalo')
        setDadosEntrSaida(filtered);
      };
    
      const handleRemoveDateFilter = () => {
        setDadosEntrSaida(agruparLucroPerda(dataPerdaLucro));
        setFilter('none')
        setShowDatePicker(false)
      }

    return (
        <>
            <div className="graph-header">
                <h4>Lucro x Perda</h4>
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
                    <BsFilter size={33} style={{ color: '#61BDE0'}} />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dadosEntrSaida}
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
                    <Area type="monotone" name="Perda" dataKey="perda" stroke="#C80000" fillOpacity={1} fill="url(#colorEntrada)" />
                    <Area type="monotone" name="Lucro" dataKey="lucro" stroke="#4FBF1A" fillOpacity={1} fill="url(#colorSaida)" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraficoLucroPerda