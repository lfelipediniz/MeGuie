import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type Data = {
  message: string;
  userId?: string;
  token?: string;
  favoriteRoadmaps?: string[];  // Adicionado para retornar os roadmaps favoritos
  seenContents?: string[];      // Adicionado para retornar os conteúdos vistos
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método HTTP não permitido.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    await dbConnect();

    // Verifica se o usuário existe
    const user = await User.findOne({ email }).select('+password'); // Inclui o campo password
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Compara a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'Erro interno do servidor.',
        error: 'Configuração do servidor inválida.',
      });
    }

    // Gera o token JWT com duração de 30 dias
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Retorna o login com os dados do usuário, incluindo roadmaps favoritos e conteúdos vistos
    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      userId: user._id.toString(),
      token,
      favoriteRoadmaps: user.favoriteRoadmaps.map((id: any) => id.toString()),  // Convertendo para string os ObjectIds
      seenContents: user.seenContents.map((id: any) => id.toString())           // Convertendo para string os ObjectIds
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro interno do servidor.',
      error: 'Internal Server Error',
    });
  }
}
