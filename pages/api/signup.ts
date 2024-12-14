import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type Data = {
  message: string;
  userId?: string;
  token?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log('Recebendo uma requisição de signup:', req.method);

  if (req.method !== 'POST') {
    console.log(`Método HTTP não permitido: ${req.method}`);
    return res.status(405).json({ message: 'Método HTTP não permitido.' });
  }

  const { name, email, password } = req.body;
  console.log('Dados recebidos para signup:', { name, email, password });

  if (!name || !email || !password) {
    console.log('Campos obrigatórios faltando:', { name, email, password });
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    await dbConnect();
    console.log('Conectado ao banco de dados.');

    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`E-mail já está em uso: ${email}`);
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Senha hasheada com sucesso.');

    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
      favoriteRoadmaps: [],  // Inicializa com um array vazio para roadmaps favoritos
      seenContents: []       // Inicializa com um array vazio para conteúdos vistos
    });

    await newUser.save();
    console.log(`Usuário salvo com sucesso: ${newUser._id}`);

    // Verifica se JWT_SECRET está definida
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definida.');
      return res.status(500).json({
        message: 'Erro interno do servidor.',
        error: 'Configuração do servidor inválida.',
      });
    }

    // Gerar token JWT com duração de 1 dia
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    console.log(`Token JWT gerado para o usuário: ${newUser._id}`);

    // Retornar o token e o ID do novo usuário convertido para string
    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      userId: newUser._id.toString(),
      token,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({
      message: 'Erro interno do servidor.',
      error: 'Internal Server Error',
    });
  }
}
