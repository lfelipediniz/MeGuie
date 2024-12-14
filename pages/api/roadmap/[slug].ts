// src/pages/api/roadmap/[slug].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Roadmap, { IRoadmap } from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';

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

    case 'PUT':
      try {
        if (typeof slug !== 'string') {
          return res.status(400).json({ message: 'Slug inválido.' });
        }
        const updatedData = body;

        // Verifica se o nameSlug está sendo atualizado e se é único
        if (updatedData.nameSlug && updatedData.nameSlug !== slug) {
          const existingRoadmap = await Roadmap.findOne({ nameSlug: updatedData.nameSlug });
          if (existingRoadmap) {
            return res.status(400).json({ message: 'nameSlug já está em uso.' });
          }
        }

        const roadmap = await Roadmap.findOneAndUpdate({ nameSlug: slug }, updatedData, { new: true });
        if (!roadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }

        return res.status(200).json(roadmap);
      } catch (error) {
        console.error('Erro ao atualizar o roadmap:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
      }

    case 'DELETE':
      try {
        if (typeof slug !== 'string') {
          return res.status(400).json({ message: 'Slug inválido.' });
        }
        const roadmap = await Roadmap.findOneAndDelete({ nameSlug: slug });
        if (!roadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }
        return res.status(200).json({ message: 'Roadmap deletado com sucesso.' });
      } catch (error) {
        console.error('Erro ao deletar o roadmap:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Método ${method} não permitido.`);
  }
}
