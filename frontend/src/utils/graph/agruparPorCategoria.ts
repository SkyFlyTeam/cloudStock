import { DadosAgrupadosQuantidade, DadosAgrupadosValor, DataQuantidade, DataValor } from "../../services/estatisticasServices";


export function agruparPorCategoriaQtd(data: DataQuantidade[]): DadosAgrupadosQuantidade[] {
    // Agrupando os dados por CategoriaPai
    const dadosAgrupados = data.reduce(
        (acumulador: { [key: string]: number }, item) => {
        // Verifica se a CategoriaPai já existe no acumulador
        if (!acumulador[item.CategoriaPai]) {
            acumulador[item.CategoriaPai] = 0;
        }

        // Soma a quantidade na CategoriaPai correspondente
        acumulador[item.CategoriaPai] += item.Quantidade;

        return acumulador;
        },
        {}
    );

    // Converte o acumulador de objeto para array
    return Object.entries(dadosAgrupados).map(([CategoriaPai, Quantidade]) => ({
        CategoriaPai: CategoriaPai,
        Quantidade,
    }));
}


export function agruparPorCategoriaValor(data: DataValor[]): DadosAgrupadosValor[] {
    // Agrupando os dados por CategoriaPai
    const dadosAgrupados = data.reduce(
        (acumulador: { [key: string]: number }, item) => {
        // Verifica se a CategoriaPai já existe no acumulador
        if (!acumulador[item.CategoriaPai]) {
            acumulador[item.CategoriaPai] = 0;
        }

        // Soma a quantidade na CategoriaPai correspondente
        acumulador[item.CategoriaPai] += item.ValorTot;

        return acumulador;
        },
        {}
    );

    // Converte o acumulador de objeto para array
    return Object.entries(dadosAgrupados).map(([CategoriaPai, ValorTot]) => ({
        CategoriaPai: CategoriaPai,
        ValorTot,
    }));
}

