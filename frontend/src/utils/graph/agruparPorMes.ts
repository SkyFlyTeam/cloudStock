// Recebe uma array data com tudo e agrupa a quantidade de saida e entrada por mês - ex Output: [{'date': '2024-01', 'saida': 2000, 'entrada': 3444 }]

type DataEntrSaida = {
  date: Date | string;
  entrada: number;
  saida: number;
};

export function agruparEntrSaidaPorMes(data: DataEntrSaida[]) {
  const dadosAgrupados = data.reduce(
    (
      acumulador: Record<string, { date: string; entrada: number; saida: number }>,
      item
    ) => {
      let date: string;

      if (typeof item.date === 'string') {
        date = item.date.slice(0, 7); // Formato: 'YYYY-MM'
      } else {
        const ano = item.date.getFullYear();
        const mes = item.date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        date = `${ano}-${mes.toString().padStart(2, '0')}`; // Formato: 'YYYY-MM'
      }

      // Se o mês ainda não existir no acumulador, cria
      if (!acumulador[date]) {
        acumulador[date] = { date, entrada: 0, saida: 0 };
      }

      // Caso contrário, acumula os valores de entrada e saída
      acumulador[date].entrada += item.entrada;
      acumulador[date].saida += item.saida;

      return acumulador;
    },
    {}
  );

  return Object.values(dadosAgrupados); // Retorna como array
}

type DataLucroPerda = {
  date: Date | string;
  lucro: number;
  perda: number;
};

export function agruparLucroPerda(data: DataLucroPerda[]) {
  const dadosAgrupados = data.reduce(
    (
      acumulador: Record<string, { date: string; lucro: number; perda: number;}>,
      item
    ) => {
      let date: string;

      if (typeof item.date === 'string') {
        date = item.date.slice(0, 7); // Formato: 'YYYY-MM'
      } else {
        const ano = item.date.getFullYear();
        const mes = item.date.getMonth() + 1; // getMonth() retorna 0-11, então somamos 1
        date = `${ano}-${mes.toString().padStart(2, '0')}`; // Formato: 'YYYY-MM'
      }

      // Se o mês ainda não existir no acumulador, cria
      if (!acumulador[date]) {
        acumulador[date] = { date, lucro: 0, perda: 0 };
      }

      // Caso contrário, acumula os valores de lucro e perda
      acumulador[date].lucro += item.lucro;
      acumulador[date].perda += item.perda;

      return acumulador;
    },
    {}
  );

  return Object.values(dadosAgrupados); // Retorna como array
}

  