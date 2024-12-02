// pages/api/users/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb'; // Conexão com o MongoDB
import User from '../../../models/User'; // Modelo do Usuário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect(); // Conecta ao MongoDB

      const { name, email } = req.body; // Pega o nome e email do corpo da requisição

      // Cria um novo usuário
      const newUser = new User({ name, email });
      await newUser.save(); // Salva no banco de dados

      res.status(201).json({
        message: 'User created',
        user: newUser,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message: 'Error creating user', error: errorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
