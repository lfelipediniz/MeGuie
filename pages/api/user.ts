import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';
import jwt from 'jsonwebtoken';
import Roadmap from '../../models/Roadmap';

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

  const { method } = req;

  // Função auxiliar para autenticar o usuário
  const authenticateUser = (): string | null => {
    const authHeader = req.headers.authorization;
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

  switch (method) {
    case 'GET':
      try {
        const userId = authenticateUser();
        if (!userId) {
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const user = await User.findById(userId)
          .select('+admin -password') // Inclui o campo admin explicitamente e remove o password
          .populate('favoriteRoadmaps', 'name')
          .populate('seenContents.roadmapId', 'name');

        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      }
      break;

    case 'PUT':
      try {
        const userId = authenticateUser();
        if (!userId) {
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const { action, roadmapId, contentId, favoriteRoadmaps } = req.body;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Atualizar favoriteRoadmaps se fornecido
        if (favoriteRoadmaps) {
          const validRoadmaps = await Roadmap.find({ _id: { $in: favoriteRoadmaps } });
          user.favoriteRoadmaps = validRoadmaps.map((r) => r._id);
        }

        // Lógica para seenContents
        if (action && roadmapId && contentId) {
          const rid = new mongoose.Types.ObjectId(roadmapId);
          const cid = new mongoose.Types.ObjectId(contentId);

          const idx = user.seenContents.findIndex(entry => entry.roadmapId.equals(rid));

          if (action === 'add') {
            if (idx === -1) {
              // Adiciona um novo roadmapId
              user.seenContents.push({
                roadmapId: rid,
                contentIds: [cid],
              });
            } else {
              // Adiciona o conteúdo sem duplicar
              const currentContentIds = user.seenContents[idx].contentIds.map(id => id.toString());
              if (!currentContentIds.includes(cid.toString())) {
                user.seenContents[idx].contentIds.push(cid);
              }
            }
          } else if (action === 'remove') {
            if (idx > -1) {
              // Remove o conteúdo
              user.seenContents[idx].contentIds = user.seenContents[idx].contentIds.filter(
                id => !id.equals(cid)
              );
              // Se não houver mais conteúdos, remover a entrada do roadmap
              if (user.seenContents[idx].contentIds.length === 0) {
                user.seenContents.splice(idx, 1);
              }
            }
          }
        }

        await user.save();
        res.status(200).json({ message: 'Dados atualizados com sucesso.', user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
