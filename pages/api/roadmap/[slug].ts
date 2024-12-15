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

    case 'PUT':
      try {
        if (typeof slug !== 'string') {
          return res.status(400).json({ message: 'Slug inválido.' });
        }

        const updatedData = body;

        // Atualizações gerais do roadmap
        const roadmapUpdateFields: Partial<IRoadmap> = {};

        if (updatedData.name) roadmapUpdateFields.name = updatedData.name;
        if (updatedData.nameSlug) roadmapUpdateFields.nameSlug = updatedData.nameSlug;
        if (updatedData.imageURL) roadmapUpdateFields.imageURL = updatedData.imageURL;
        if (updatedData.imageAlt) roadmapUpdateFields.imageAlt = updatedData.imageAlt;

        // Verifica se o nameSlug está sendo atualizado e se é único
        if (updatedData.nameSlug && updatedData.nameSlug !== slug) {
          const existingRoadmap = await Roadmap.findOne({ nameSlug: updatedData.nameSlug });
          if (existingRoadmap) {
            return res.status(400).json({ message: 'nameSlug já está em uso.' });
          }
        }

        // Atualizações específicas de nodes e contents
        if (updatedData.nodes) {
          for (const nodeUpdate of updatedData.nodes) {
            const { nodeId, contentsToUpdate, contentsToDelete } = nodeUpdate;

            // Encontrar o nó específico
            const node = await Roadmap.findOne({ nameSlug: slug, 'nodes._id': nodeId }, { 'nodes.$': 1 });
            if (!node || !node.nodes || node.nodes.length === 0) {
              return res.status(404).json({ message: `Node com ID ${nodeId} não encontrado.` });
            }

            // Atualizar conteúdos
            if (contentsToUpdate && Array.isArray(contentsToUpdate)) {
              for (const contentUpdate of contentsToUpdate) {
                const { contentId, type, title, url } = contentUpdate;

                // Validação dos campos a serem atualizados
                if (type && !['vídeo', 'website'].includes(type)) {
                  return res.status(400).json({ message: `Tipo de conteúdo inválido: ${type}.` });
                }

                // Atualizar o conteúdo específico
                const updateResult = await Roadmap.updateOne(
                  { nameSlug: slug, 'nodes._id': nodeId, 'nodes.contents._id': contentId },
                  {
                    $set: {
                      'nodes.$.contents.$[content].type': type,
                      'nodes.$.contents.$[content].title': title,
                      'nodes.$.contents.$[content].url': url,
                    },
                  },
                  {
                    arrayFilters: [{ 'content._id': contentId }],
                  }
                );

                if (updateResult.modifiedCount === 0) {
                  return res.status(404).json({ message: `Conteúdo com ID ${contentId} não encontrado no node ${nodeId}.` });
                }
              }
            }

            // Excluir conteúdos
            if (contentsToDelete && Array.isArray(contentsToDelete)) {
              for (const contentId of contentsToDelete) {
                const deleteResult = await Roadmap.updateOne(
                  { nameSlug: slug, 'nodes._id': nodeId },
                  {
                    $pull: { 'nodes.$.contents': { _id: contentId } },
                  }
                );

                if (deleteResult.modifiedCount === 0) {
                  return res.status(404).json({ message: `Conteúdo com ID ${contentId} não encontrado para deletar no node ${nodeId}.` });
                }
              }
            }
          }
        }

        // Atualizar campos gerais do roadmap
        const roadmap = await Roadmap.findOneAndUpdate({ nameSlug: slug }, roadmapUpdateFields, { new: true });
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
