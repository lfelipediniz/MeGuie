// Acho que não vai precisar fazer essa requisição, pois pelo frontend é possível filtrar todos os roadmaps para pegar apenas os roadmaps cujo id está na lista de ids de roadmaps favoritos do usuáio


import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Roadmap from '../../models/Roadmap';
import User from '../../models/User';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { method, headers, query } = req;

  // Middleware para verificar o token de autenticação
  const authenticate = (): string | null => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded.userId;
    } catch {
      return null;
    }
  };

  const userId = authenticate();

  if (!userId) {
    return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  switch (method) {
    // GET: Lista os roadmaps favoritos do usuário
    case 'GET':
      try {
        // Buscar o usuário para pegar os roadmaps favoritos
        const user = await User.findById(userId).select('favoriteRoadmaps');
        
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Buscar os roadmaps com os IDs que o usuário tem como favorito
        const favoriteRoadmaps = await Roadmap.find({
          '_id': { $in: user.favoriteRoadmaps }
        }).populate({
          path: 'nodes.contents',
          model: 'Content',
        });

        res.status(200).json(favoriteRoadmaps);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar roadmaps favoritos.' });
      }
      break;

    // Método não permitido
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
