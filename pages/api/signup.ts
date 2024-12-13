// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcryptjs';

// Adicione o campo `userId` no tipo Data para retornar o ID do usuário
type Data = {
  message: string;
  userId?: string; // Adicionado para retornar o ObjectId
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método HTTP não permitido.' });
  }

  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Conectar ao banco de dados
    await dbConnect();

    // Verificar se o e-mail já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Retornar o ID do novo usuário
// Retornar o ID do novo usuário convertido para string
return res.status(201).json({ message: 'Usuário cadastrado com sucesso.', userId: newUser._id.toString() });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.', error: 'Internal Server Error' });
  }
}
