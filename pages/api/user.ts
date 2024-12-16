// src/pages/api/user.ts

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
          console.log("GET /api/user: Token inválido ou ausente.");
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const user = await User.findById(userId)
          .select('+admin -password') // Inclui o campo admin explicitamente e remove o password
          .populate('favoriteRoadmaps', '_id name');

        if (!user) {
          console.log(`GET /api/user: Usuário com ID ${userId} não encontrado.`);
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
      } catch (error: any) {
        console.error("GET /api/user error:", error);
        res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
      }
      break;

    case 'PUT':
      try {
        const userId = authenticateUser();
        if (!userId) {
          console.log("PUT /api/user: Token inválido ou ausente.");
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const { action, roadmapId, nodeId, contentId, favoriteRoadmaps } = req.body;

        console.log("PUT /api/user: Recebido body:", req.body);

        const user = await User.findById(userId);
        if (!user) {
          console.log(`PUT /api/user: Usuário com ID ${userId} não encontrado.`);
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Atualizar favoriteRoadmaps se fornecido diretamente
        if (favoriteRoadmaps) {
          console.log("PUT /api/user: Atualizando favoriteRoadmaps:", favoriteRoadmaps);
          const validRoadmaps = await Roadmap.find({ _id: { $in: favoriteRoadmaps } });
          const validRoadmapIds = validRoadmaps.map((r) => r._id.toString());
          console.log("PUT /api/user: Roadmaps válidos encontrados:", validRoadmapIds);
          user.favoriteRoadmaps = validRoadmapIds;
        }

        // Lógica para toggle de seenContents
        if (action && roadmapId && nodeId && contentId) {
          const rid = roadmapId;
          const nid = nodeId;
          const cid = contentId;

          console.log(`PUT /api/user: Processando ação '${action}' para roadmapId '${rid}', nodeId '${nid}', contentId '${cid}'.`);

          // Encontra o índice do roadmap na lista de seenContents
          const roadmapIndex = user.seenContents.findIndex((entry) => entry.roadmapId === rid);
          console.log(`PUT /api/user: Índice do roadmap (${rid}) em seenContents: ${roadmapIndex}`);

          if (action === 'add') {
            if (roadmapIndex === -1) {
              // Adiciona um novo roadmapId e nodeId
              console.log(`PUT /api/user: Adicionando novo roadmapId '${rid}' com nodeId '${nid}' e contentId '${cid}'.`);
              user.seenContents.push({
                roadmapId: rid,
                nodes: [{ nodeId: nid, contentIds: [cid] }],
              });
            } else {
              const nodeIndex = user.seenContents[roadmapIndex].nodes.findIndex(
                (node) => node.nodeId === nid
              );
              console.log(`PUT /api/user: Índice do node (${nid}) em roadmap (${rid}): ${nodeIndex}`);

              if (nodeIndex === -1) {
                // Adiciona um novo nodeId com o contentId
                console.log(`PUT /api/user: Adicionando novo nodeId '${nid}' com contentId '${cid}' no roadmap '${rid}'.`);
                user.seenContents[roadmapIndex].nodes.push({
                  nodeId: nid,
                  contentIds: [cid],
                });
              } else {
                // Adiciona o contentId sem duplicar
                if (!user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.includes(cid)) {
                  console.log(`PUT /api/user: Adicionando contentId '${cid}' ao nodeId '${nid}' no roadmap '${rid}'.`);
                  user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.push(cid);
                } else {
                  console.log(`PUT /api/user: contentId '${cid}' já existe no nodeId '${nid}' no roadmap '${rid}'.`);
                }
              }
            }
          } else if (action === 'remove') {
            if (roadmapIndex > -1) {
              const nodeIndex = user.seenContents[roadmapIndex].nodes.findIndex(
                (node) => node.nodeId === nid
              );
              console.log(`PUT /api/user: Índice do node (${nid}) para remoção: ${nodeIndex}`);

              if (nodeIndex > -1) {
                // Remove o conteúdo específico do node
                console.log(`PUT /api/user: Removendo contentId '${cid}' do nodeId '${nid}' no roadmap '${rid}'.`);
                user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds = user.seenContents[
                  roadmapIndex
                ].nodes[nodeIndex].contentIds.filter((id) => id !== cid);

                // Se o node não tiver mais conteúdos, remove o node
                if (user.seenContents[roadmapIndex].nodes[nodeIndex].contentIds.length === 0) {
                  console.log(`PUT /api/user: Removendo nodeId '${nid}' do roadmap '${rid}' pois não há mais contentIds.`);
                  user.seenContents[roadmapIndex].nodes.splice(nodeIndex, 1);
                }

                // Se o roadmap não tiver mais nodes, remove o roadmap
                if (user.seenContents[roadmapIndex].nodes.length === 0) {
                  console.log(`PUT /api/user: Removendo roadmapId '${rid}' pois não há mais nodes.`);
                  user.seenContents.splice(roadmapIndex, 1);
                }
              } else {
                console.log(`PUT /api/user: NodeId '${nid}' não encontrado no roadmapId '${rid}'.`);
              }
            } else {
              console.log(`PUT /api/user: RoadmapId '${rid}' não encontrado em seenContents.`);
            }
          }
        }

        // Lógica para adicionar/remover favoritos
        if (action && roadmapId) {
          if (action === 'favorite_add') {
            if (!user.favoriteRoadmaps.includes(roadmapId)) {
              console.log(`PUT /api/user: Adicionando roadmapId '${roadmapId}' aos favoritos.`);
              user.favoriteRoadmaps.push(roadmapId);
            } else {
              console.log(`PUT /api/user: roadmapId '${roadmapId}' já está nos favoritos.`);
            }
          } else if (action === 'favorite_remove') {
            console.log(`PUT /api/user: Removendo roadmapId '${roadmapId}' dos favoritos.`);
            user.favoriteRoadmaps = user.favoriteRoadmaps.filter((id) => id !== roadmapId);
          }
        }

        console.log("PUT /api/user: Salvando usuário...");
        await user.save();
        console.log("PUT /api/user: Usuário salvo com sucesso.");

        res.status(200).json({ message: 'Dados atualizados com sucesso.', user });
      } catch (error: any) {
        console.error("PUT /api/user error:", error);
        res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'GET']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
