import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const controllerAuth = {
    checkLogin: async (req, res) => {
        try{
          const { email, senha } = req.body;
          const usuario = await Usuario.findOne({ where: { Usuario_email: email }});
    
          if(!usuario){
            return res.status(404).json({ error: 'Email ou senha inválidos.' });
          }

          if (!usuario.Usuario_status) {
            return res.status(404).json({ error: 'A conta está inativa.' });
          }

          const verifyPassword = await bcrypt.compare(senha, usuario['Usuario_senha'])
          
          if(!verifyPassword){
            return res.status(404).json({ error: 'Email ou senha inválidos.' });
          }

          const authToken = jwt.sign({id: usuario['Usuario_id'], cargo: usuario['Cargo_id']}, 'SkyFly', {expiresIn: '8h'}) // gerando token 
          
          const { Usuario_senha, ...usuarioLogin } = usuario.toJSON() //tirando a senha antes de retornar

          return res.status(200).json({ usuarioLogin, authToken });
        } catch(error){
          return res.status(500).json({ error: 'Erro ao logar' });
        }
    }
}