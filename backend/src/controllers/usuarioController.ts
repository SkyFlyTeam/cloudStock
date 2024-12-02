import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { Entrada } from '../models/Entrada';
import { Saida } from '../models/Saida';
import { Cargo } from '../models/Cargo';
import bcrypt from 'bcrypt'

export const controllerUsuario = {
  // POST /usuario
  save: async (req: Request, res: Response) => {
    try {
      const { Usuario_nome, Usuario_email, Usuario_senha, Cargo_id } = req.body;

      const userExists = await Usuario.findOne({ where: { Usuario_email: Usuario_email }});

      if (userExists){
        return res.status(404).json({ message: 'Email já cadastrado'});
      }
      
      const hashPassword = await bcrypt.hash(Usuario_senha, 10)

      let usuario_id=req.headers.usuario_id[0]

      usuario_id = usuario_id

      const usuario = await Usuario.create({
        Usuario_email,
        Usuario_senha: hashPassword,
        Usuario_nome,
        Usuario_status: true,
        Usuario_dataCriacao: new Date(),
        Cargo_id,
        usuario_id: usuario_id
      });

      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving Usuario', details: error.message });
    }
  },

  // GET /usuario
  show: async (req: Request, res: Response) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [Cargo, Entrada, Saida] // Incluindo cargos, entradas e saídas
      });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching Usuario', details: error.message });
    }
  },

   // GET /:id usuario específico
   showSpecific: async(req: Request, res: Response) => {
    const { id } = req.params
    try{
      const usuario = await Usuario.findByPk(id, {
        attributes: {exclude: ['Usuario_senha']},
        include: [Cargo, Entrada, Saida]
      })
      if (!usuario){
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.status(200).json(usuario)
    } catch(error){
      return res.status(400).json({ error: 'Erro ao buscar usuario', details: error.message });
    }
  },

  // PUT /usuario/:id
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
      }

      const instance = await Usuario.findByPk(id);


      const usuario_id=req.headers.usuario_id[0]
      const updated = await instance.update(req.body, {individualHooks: true, context: { usuario_id: usuario_id }});

      if (updated) {
        const updatedUsuario = await Usuario.findOne({ where: { Usuario_id: id } });
        return res.status(200).json(updatedUsuario);
      }
      return res.status(404).json({ error: 'Usuario not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error updating Usuario', details: error.message });
    }
  },

  // PUT /status/:id 
  changeStatus: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o usuário pelo ID
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Alternar o status atual (se for true, muda para false e vice-versa)
      const novoStatus = !usuario.Usuario_status;

      // Capturar o ID do usuário
      const usuario_id = req.headers.usuario_id?.[0];
      if (!usuario_id) {
        return res.status(400).json({ error: 'Usuário não identificado no header' });
      }
  
      // Atualizar o status no banco de dados
      const updated = await usuario.update(
        { Usuario_status: novoStatus }, // Fields you want to update
        {
          individualHooks: true, // Ensure hooks run for this specific instance
          context: { usuario_id: usuario_id }, // Pass the context here
        } as any // Cast to `any` if TypeScript throws a type error
      );
      
  
      // Retornar o novo status atualizado
      return res.status(200).json({ message: "Status alterado com sucesso", usuario });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao alterar o status do usuário' });
    }
  },
  changeCargo: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o usuário pelo ID
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Alternar o cargo atual (1 => 2 ou 2 => 1)
      const novoCargoId = usuario.Cargo_id === 1 ? 2 : 1;

  
      // Atualizar o status no banco de dados
      await Usuario.update(
        { Cargo_id: novoCargoId },
        { where: { Usuario_id: id } }
      );
  
      // Retornar o novo status atualizado
      return res.status(200).json({ message: "Status alterado com sucesso", usuario });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao alterar o status do usuário' });
    }
  }
}