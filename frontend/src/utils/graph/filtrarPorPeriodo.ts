export function filtrarDadosPorPeriodo(data: any[], inicio: string | number | Date, fim: string | number | Date) {
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
  
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= inicioDate && itemDate <= fimDate;
    });
  }
  