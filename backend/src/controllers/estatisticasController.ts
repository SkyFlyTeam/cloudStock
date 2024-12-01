import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada';
import { Op } from 'sequelize';
import { Saida } from '../models/Saida';
import { Lote } from '../models/Lote';
import { Produto } from '../models/Produto';
import { Categoria } from '../models/Categoria';

export const controllerEstatisticas = {
    showLucro: async (req: Request, res: Response) => {
        try {
            let data = [];
    
            let entrada = await Entrada.findAll();
            let saida = await Saida.findAll();
    
            entrada.forEach(ent => {
                let thisDate = ent.Ent_dataCriacao.toISOString().split('T')[0]; // AAAA-MM-DD
                let hasDate = false;
    
                data.forEach(d => {
                    if (d.date === thisDate) {
                        d.gastos += parseFloat(ent.Ent_valortot.toString());
                        d.lucro -= parseFloat(ent.Ent_valortot.toString());
                        hasDate = true;
                    }
                });
    
                if (!hasDate) {
                    let values = {
                        date: thisDate,
                        lucro: -1 * parseFloat(ent.Ent_valortot.toString()),
                        ganhos: 0,
                        gastos: parseFloat(ent.Ent_valortot.toString()),
                        perda: 0
                    };
                    data.push(values);
                }
            });
    
            saida.forEach(sai => {
                let thisDate = sai.Saida_dataCriacao.toISOString().split('T')[0]; // AAAA-MM-DD
                let hasDate = false;
    
                data.forEach(d => {
                    if (d.date === thisDate && sai.Saida_isVenda === true) {
                        d.lucro += parseFloat(sai.Saida_valorTot.toString());
                        d.ganhos += parseFloat(sai.Saida_valorTot.toString())
                        hasDate = true;
                    } else if (d.date === thisDate && sai.Saida_isVenda === false) {
                        d.perda += parseFloat(sai.Saida_valorTot.toString());
                        d.lucro -= parseFloat(sai.Saida_valorTot.toString());
                        hasDate = true;
                    }
                });
    
                if (sai.Saida_isVenda === true && !hasDate) {
                    let values = {
                        date: thisDate,
                        lucro: parseFloat(sai.Saida_valorTot.toString()),
                        ganhos: parseFloat(sai.Saida_valorTot.toString()),
                        gastos: 0,
                        perda: 0
                    };
                    data.push(values);
                } else if (!hasDate) {
                    let values = {
                        date: thisDate,
                        lucro: -1 * parseFloat(sai.Saida_valorTot.toString()),
                        ganhos: 0,
                        gastos: 0,
                        perda: parseFloat(sai.Saida_valorTot.toString())
                    };
                    data.push(values);
                }
            });
            
            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            res.status(200).json(data);
    
        } catch (error) {
            res.status(500).json({ error: `Erro ao calcular o lucro: ${error}` });
        }
    },
    

    showPerda: async (req: Request, res: Response) => {
        try {
            let data = [];
    
            let saida = await Saida.findAll();
    
            saida.forEach(sai => {
                // Formata a data para o formato AAAA-MM-DD
                let thisDate = sai.Saida_dataCriacao.toISOString().split('T')[0];
                let hasDate = false;
    
                data.forEach(d => {
                    if (d.date === thisDate && sai.Saida_isVenda === false) {
                        d.perda += parseFloat(sai.Saida_valorTot.toString());
                        hasDate = true;
                    }
                });
    
                if (sai.Saida_isVenda === false && hasDate === false) {
                    let values = {
                        date: thisDate,
                        perda: parseFloat(sai.Saida_valorTot.toString())
                    };
                    data.push(values);
                }
            });

            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            res.status(200).json(data);
    
        } catch (error) {
            res.status(500).json({ error: `Erro ao calcular a perda: ${error}` });
        }
    },

    getMaiorEntrada: async (req, res) => {
        try {
            const entradas = await Entrada.findAll({
                include: [
                    {
                        model: Lote,
                        include: [
                            {
                                model: Produto,
                                include: [{
                                    model: Categoria
                                }]
                            }
                        ]
                    }
                ],
            })

            if(!entradas){
                return res.status(400).json({message: 'erro ao encontrar entradas'})
            }

            const lista = []
            entradas.forEach((e) => {
                e.Lotes.forEach((l) => {
                    const existente = lista.find((li) => l['Produtos']['Prod_nome'] === li['Prod_nome'])
                    if(existente){
                        existente['Quantidade'] += l['Lote_Entrada']['Ent_quantidade']
                        return
                    }
                    const nome = l['Produtos']['Prod_nome']
                    const categoria = l['Produtos']['Categoria']['Categoria_nome']
                    const quantidade = l['Lote_Entrada']['Ent_quantidade']
                    lista.push({
                        Prod_nome: nome,
                        CategoriaPai: categoria,
                        Quantidade: quantidade
                    })
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['Quantidade'] - a['Quantidade'])

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            res.status(500).json({error: `Erro ao acessar entradas: ${error}`})
        }
    },

    getMaiorSaida: async (req, res) => {
        try {
            const saidas = await Saida.findAll({
                include: [
                    {
                        model: Lote,
                        include: [
                            {
                                model: Produto,
                                include: [{
                                    model: Categoria
                                }]
                            }
                        ]
                    }
                ],
            })

            if(!saidas){
                return res.status(400).json({message: 'erro ao encontrar saidas'})
            }

            const lista = []
            saidas.forEach((s) => {
                s.Lotes.forEach((l) => {
                    const existente = lista.find((li) => l['Produtos']['Prod_nome'] === li['Prod_nome'])
                    if(existente){
                        existente['Quantidade'] += l['Lote_Saida']['Saida_quantidade']
                        return
                    }
                    const nome = l['Produtos']['Prod_nome']
                    const categoria = l['Produtos']['Categoria']['Categoria_nome']
                    const quantidade = l['Lote_Saida']['Saida_quantidade']
                    lista.push({
                        Prod_nome: nome,
                        CategoriaPai: categoria,
                        Quantidade: quantidade
                    })
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['Quantidade'] - a['Quantidade'])

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            res.status(500).json({error: `Erro ao acessar saídas: ${error}`})
        }
    },

    getMaiorRentabildiade: async (req, res) => {
        try {
            const lotes = await Lote.findAll({
                include: [
                    {
                        model: Entrada
                    },
                    {
                        model: Saida
                    },
                    {
                        model: Produto,
                        include: [
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]
            })

            const lista = []
            lotes.forEach((l) => {
                const nome = l['Produtos']['Prod_nome']
                const categoria = l['Produtos']['Categoria']['Categoria_nome']
                const entradaQtd = l.Entradas.reduce((acc, atual) => acc + atual['Lote_Entrada']['Ent_quantidade'], 0)
                const custoTotal = entradaQtd * l['Produtos']['Prod_custo']
                const saidaQtd = l.Saidas.reduce((acc, atual) => acc + atual['Lote_Saida']['Saida_quantidade'], 0)
                const vendaTotal = saidaQtd * l['Produtos']['Prod_preco']
                const valorTotal = vendaTotal - custoTotal

                const existente = lista.find((li) => li['Prod_nome'] === nome)
                if(existente){
                    existente['ValorTot'] += valorTotal
                    return
                }

                lista.push({
                    Prod_nome: nome, 
                    CategoriaPai: categoria, 
                    ValorTot: valorTotal
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['ValorTot'] - a['ValorTot'])

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            return res.status(500).json({error: `Erro ao acessar produtos: ${error}`})
        }
    },

    getMaiorCusto: async (req, res) => {
        try {
            const lotes = await Lote.findAll({
                include: [
                    {
                        model: Entrada
                    },
                    {
                        model: Saida
                    },
                    {
                        model: Produto,
                        include: [
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]
            })

            const lista = []
            lotes.forEach((l) => {
                const nome = l['Produtos']['Prod_nome']
                const categoria = l['Produtos']['Categoria']['Categoria_nome']
                const entradaQtd = l.Entradas.reduce((acc, atual) => acc + atual['Lote_Entrada']['Ent_quantidade'], 0)
                const custoTotal = entradaQtd * l['Produtos']['Prod_custo']

                const existente = lista.find((li) => li['Prod_nome'] === nome)
                if(existente){
                    existente['ValorTot'] += custoTotal
                    return
                }

                lista.push({
                    Prod_nome: nome, 
                    CategoriaPai: categoria, 
                    ValorTot: custoTotal
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['ValorTot'] - a['ValorTot'])

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            return res.status(500).json({error: `Erro ao acessar produtos: ${error}`})
        }
    },

    getValorEntradaSaida: async (req, res) => {
        try {
            let data = [];
    
            let entrada = await Entrada.findAll();
            let saida = await Saida.findAll();
    
            entrada.forEach(ent => {
                let thisDate = ent.Ent_dataCriacao.toISOString().split('T')[0];
                let entradaValor = parseFloat(ent.Ent_valortot.toString());
    
                let existingEntry = data.find(d => d.date === thisDate);
    
                if (existingEntry) {
                    existingEntry.entrada += entradaValor;
                } else {
                    let values = { date: thisDate, entrada: entradaValor, saida: 0 };
                    data.push(values);
                }
            });
    
            saida.forEach(sai => {
                let thisDate = sai.Saida_dataCriacao.toISOString().split('T')[0];
                let saidaValor = parseFloat(sai.Saida_valorTot.toString());
                let hasDate = false;
    
                if (sai.Saida_isVenda === true) {
                    data.forEach(d => {
                        if (d.date === thisDate) {
                            d.saida += saidaValor;
                            hasDate = true;
                        }
                    });
                }
    
                if (sai.Saida_isVenda === true && !hasDate) {
                    let values = { date: thisDate, entrada: 0, saida: saidaValor };
                    data.push(values);
                }
            });
    
            data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            res.status(200).json(data);
    
        } catch (error) {
            res.status(500).json({ error: `Erro ao calcular o valor de Entrada e Saída: ${error}` });
        }
    },

    getProdutosComEstoqueBaixo: async (req: Request, res: Response) => {
        try {
            const produtos = await Produto.findAll({
                include: [
                    {
                        model: Lote,
                        attributes: ["Lote_quantidade"]
                    }
                ],
                attributes: [
                    "Prod_cod",
                    "Prod_nome",
                    "Prod_estoqueMinimo"
                ]
            });
            if (!produtos.length) {
                return res.status(404).json({ error: "Nenhum produto encontrado." });
            }
            const produtosComEstoqueBaixo = produtos
                .map((produto) => {
                    const estoqueTotal = produto.Lotes.reduce(
                        (total, lote) => total + lote.Lote_quantidade,
                        0
                    );
                    return {
                        Prod_cod: produto.Prod_cod,
                        Prod_nome: produto.Prod_nome,
                        EstoqueAtual: estoqueTotal,
                        EstoqueMinimo: produto.Prod_estoqueMinimo
                    };
                })
                .filter(({ EstoqueAtual, EstoqueMinimo }) => EstoqueAtual < EstoqueMinimo);
            const totalEstoqueBaixo = produtosComEstoqueBaixo.length;
            // Retorno da resposta
            return res.status(200).json({
                totalEstoqueBaixo,
                produtos: produtosComEstoqueBaixo
            });
        } catch (error) {
            return res.status(500).json({ error: `Erro ao buscar produtos com estoque baixo: ${error}` });
        }
    },

    getProdutosComValidadeProxima: async (req: Request, res: Response) => {
        try {
            const hoje = new Date();
            const dataLimite = new Date();
            dataLimite.setDate(hoje.getDate() + 30);
            const produtos = await Produto.findAll({
                include: [
                    {
                        model: Lote,
                        attributes: ["Lote_validade", "Lote_quantidade"]
                    }
                ],
                attributes: [
                    "Prod_cod",
                    "Prod_nome"
                ]
            });
            if (!produtos.length) {
                return res.status(404).json({ error: "Nenhum produto encontrado." });
            }
            const produtosComValidadeProxima = produtos
                .map((produto) => {
                    const lotesValidos = produto.Lotes.filter((lote) => {
                        const validadeLote = new Date(lote.Lote_validade);
                        return validadeLote <= dataLimite && validadeLote >= hoje;
                    });
                    return {
                        Prod_cod: produto.Prod_cod,
                        Prod_nome: produto.Prod_nome,
                        LotesValidos: lotesValidos.map((lote) => ({
                            Validade: lote.Lote_validade,
                            Quantidade: lote.Lote_quantidade
                        }))
                    };
                })
                .filter(({ LotesValidos }) => LotesValidos.length > 0);
            const totalValidadeProxima = produtosComValidadeProxima.length;
            return res.status(200).json({
                totalValidadeProxima,
                produtos: produtosComValidadeProxima
            });
        } catch (error) {
            return res.status(500).json({ error: `Erro ao buscar produtos com validade próxima: ${error}` });
        }
    },
    contarTotalProdutos: async (req: Request, res: Response) => {
        try {
            // Contar o número total de produtos
            const totalProdutos = await Produto.count();
            // Retornar o total
            return res.status(200).json({ totalProdutos });
        } catch (error) {
            return res.status(500).json({ error: `Erro ao contar produtos: ${error}` });
        }
    },

    showTabelaEntradaSaidaLucro: async (req: Request, res: Response) => {
        let Lucro = 0;
        let Saidas = 0;
        let Entradas = 0;
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 30);
        try{
            const entradas = await Entrada.findAll({
                where: {
                Ent_dataCriacao: {
                    [Op.between]: [pastDate, today],
                },
                },
            });
            const saidas = await Saida.findAll({
                where: {
                Saida_dataCriacao: {
                    [Op.between]: [pastDate, today],
                },
                },
            });
            entradas.forEach((e) => {
                Entradas += parseFloat(e.Ent_valortot.toString());
            })
            saidas.forEach((s) => {
                if (s.Saida_isVenda === true) {
                    Saidas += parseFloat(s.Saida_valorTot.toString());
                }
                
            })
            res.status(200).json({Entradas: Entradas, Saidas: Saidas, Lucro: Saidas - Entradas});
        }
        catch(error) {
            res.status(500).json({ error: `Erro ao buscar entradas: ${error.message}` });
        } 
    }
}
