import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';
import jwt from 'jsonwebtoken';
import Roadmap from '../../models/Roadmap'; // Para validar roadmaps

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
    // GET: Obter informações do usuário
    case 'GET':
      try {
        const userId = authenticateUser();

        if (!userId) {
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const user = await User.findById(userId)
          .select('+admin -password') // Inclui o campo admin explicitamente e remove o password
          .populate('favoriteRoadmaps', 'name') // Popula os roadmaps favoritos com os nomes
          .populate('seenContents.roadmapId', 'name'); // Popula os roadmaps dos conteúdos vistos com os nomes

        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      }
      break;

    // PUT: Atualizar favoriteRoadmaps ou seenContents
    case 'PUT':
      try {
        const userId = authenticateUser();

        if (!userId) {
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const { favoriteRoadmaps, seenContents } = req.body;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Atualizar favoriteRoadmaps
        if (favoriteRoadmaps) {
          // Garantir que estamos adicionando IDs de roadmaps válidos
          const validRoadmaps = await Roadmap.find({ _id: { $in: favoriteRoadmaps } });
          user.favoriteRoadmaps = validRoadmaps.map((r) => r._id);
        }

        // Atualizar seenContents agrupados por roadmapId
        if (seenContents) {
          for (const entry of seenContents) {
            const { roadmapId, contentIds } = entry;

            // Validar se o roadmap existe
            const roadmapExists = await Roadmap.findById(roadmapId);
            if (!roadmapExists) {
              return res.status(400).json({ message: `Roadmap com ID ${roadmapId} não encontrado.` });
            }

            // Encontrar o índice do roadmapId em seenContents
            const existingEntryIndex = user.seenContents.findIndex((item) => item.roadmapId.equals(roadmapId));

            if (existingEntryIndex >= 0) {
              // Se já existe, adicionar os novos contentIds sem duplicar
              user.seenContents[existingEntryIndex].contentIds = [
                ...Array.from(new Set([...user.seenContents[existingEntryIndex].contentIds, ...contentIds])),
              ];
            } else {
              // Se não existe, adicionar uma nova entrada
              user.seenContents.push({
                roadmapId: new mongoose.Types.ObjectId(roadmapId),
                contentIds: contentIds.map((id: string) => new mongoose.Types.ObjectId(id)),
              });
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

    // Método não permitido
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
