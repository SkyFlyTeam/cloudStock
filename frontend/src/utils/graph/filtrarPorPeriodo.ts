export function filtrarDadosPorPeriodo(data: any[], inicio: string | number | Date, fim: string | number | Date) {
    const inicioDate = new Date(inicio);
    console.log('inicioDate', inicioDate)
    const fimDate = new Date(fim);
    console.log('fimDate', fimDate)
  
    return data.filter((item) => {
      const [year, month, day] = item.date.split('-').map(Number); // Extrair ano, mês, dia
      const itemDate = new Date(year, month - 1, day); // Criar data local
      console.log('data comparada', itemDate)
      return itemDate >= inicioDate && itemDate <= fimDate;
    });
  }
  