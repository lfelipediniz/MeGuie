import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Roadmap from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, headers, body, query } = req;

  if (method !== 'DELETE') {
    return res.setHeader('Allow', ['DELETE']).status(405).end(`Método ${method} não permitido.`);
  }

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

  try {
    const { id } = query;
    const { edgesToDelete } = body;

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap não encontrado.' });
    }

    // Remover os edges pelo _id
    roadmap.edges = roadmap.edges.filter((edge) => !edgesToDelete.includes(edge._id.toString()));

    await roadmap.save();

    res.status(200).json({ message: 'Conexões deletadas com sucesso.', roadmap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar conexões.' });
  }
}
