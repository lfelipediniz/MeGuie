import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../models/User';
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
          .populate('seenContents.roadmapId', 'name'); // Verifique se 'roadmapId' está sendo populado corretamente
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

        const { action, roadmapId, nodeId, contentId, favoriteRoadmaps } = req.body;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Atualizar favoriteRoadmaps se fornecido
        if (favoriteRoadmaps) {
          const validRoadmaps = await Roadmap.find({ _id: { $in: favoriteRoadmaps } });
          user.favoriteRoadmaps = validRoadmaps.map((r) => r._id);
        }

        // Lógica para toggle de seenContents
        if (action && roadmapId && nodeId && contentId) {
          let rid, nid, cid;
          try {
            rid = new mongoose.Types.ObjectId(roadmapId);
            nid = new mongoose.Types.ObjectId(nodeId);
            cid = new mongoose.Types.ObjectId(contentId);
          } catch (err) {
            return res.status(400).json({ message: 'Invalid roadmapId, nodeId, or contentId.' });
          }

          // Encontra o índice do roadmap na lista de seenContents
          const roadmapIndex = user.seenContents.findIndex((entry) => entry.roadmapId.equals(rid));

          if (action === 'add') {
            if (roadmapIndex === -1) {
              // Adiciona um novo roadmapId e nodeId
              user.seenContents.push({
                roadmapId: rid,
                nodes: [{ nodeId: nid, contentIds: [cid] }],
              });
            } else {
              const nodeIndex = user.seenContents[roadmapIndex].nodes.findIndex((node) =>
                node.nodeId.equals(nid)
              );

              if (nodeIndex === -1) {
                // Adiciona um novo nodeId com o contentId
                user.seenContents[roadmapIndex].nodes.push({
                  nodeId: nid,
                  contentIds: [cid],
                });
              } else {
                // Adiciona o contentId sem duplicar
                const currentContentIds = user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.map((id) =>
                  id.toString()
                );
                if (!currentContentIds.includes(cid.toString())) {
                  user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.push(cid);
                }
              }
            }
          } else if (action === 'remove') {
            if (roadmapIndex > -1) {
              const nodeIndex = user.seenContents[roadmapIndex].nodes.findIndex((node) =>
                node.nodeId.equals(nid)
              );

              if (nodeIndex > -1) {
                // Remove o conteúdo específico do node
                user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds = user.seenContents[
                  roadmapIndex
                ].nodes[nodeIndex].contentIds.filter((id) => !id.equals(cid));

                // Se o node não tiver mais conteúdos, remove o node
                if (user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.length === 0) {
                  user.seenContents[roadmapIndex].nodes.splice(nodeIndex, 1);
                }

                // Se o roadmap não tiver mais nodes, remove o roadmap
                if (user.seenContents[roadmapIndex].nodes.length === 0) {
                  user.seenContents.splice(roadmapIndex, 1);
                }
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
      res.setHeader('Allow', ['PUT', 'GET']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }

}
