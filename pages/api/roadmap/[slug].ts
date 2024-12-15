// src/pages/api/roadmap/[slug].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Roadmap, { IRoadmap, INode, IContent } from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';
import mongoose, { Types } from 'mongoose';

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, headers, query, body } = req;
  const { slug } = query;

  // Função para autenticar o usuário
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
    case 'GET':
      try {
        if (typeof slug !== 'string') {
          return res.status(400).json({ message: 'Slug inválido.' });
        }
        const roadmap = await Roadmap.findOne({ nameSlug: slug });
        if (!roadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }
        return res.status(200).json(roadmap);
      } catch (error) {
        console.error('Erro ao buscar o roadmap:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
      }


    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Método ${method} não permitido.`);
  }
}
