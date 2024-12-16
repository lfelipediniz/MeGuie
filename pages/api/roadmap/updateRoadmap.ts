import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Roadmap from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, headers, body } = req;

  // Middleware para verificar o token de autenticação
  const authenticate = (): { userId: string } | null => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { userId: decoded.userId };
    } catch {
      return null;
    }
  };

  const auth = authenticate();

  if (!auth) {
    return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  // essa verificação precisa ser feita
  const isAdmin = true; 

  if (!isAdmin) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  switch (method) {
    case 'PUT':
      try {
        const { id, name, nameSlug, imageURL, imageAlt, nodes, edges } = body;

        if (!id) {
          return res.status(400).json({ message: 'ID do roadmap é obrigatório.' });
        }

        // Validações básicas
        if (!name || !nameSlug || !imageURL || !imageAlt) {
          return res.status(400).json({ message: 'Os campos nome, nameSlug, imageURL e imageAlt são obrigatórios.' });
        }

        if (!Array.isArray(nodes) || nodes.length === 0) {
          return res.status(400).json({ message: 'É necessário adicionar pelo menos um node.' });
        }

        // Buscar o roadmap existente
        const existingRoadmap = await Roadmap.findById(id);
        if (!existingRoadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }

        // Criar um mapeamento de ID para nome para o roadmap existente
        const existingNodeMap: { [key: string]: string } = {};
        existingRoadmap.nodes.forEach(node => {
          existingNodeMap[node._id.toString()] = node.name;
        });

        // Criar um mapeamento de ID para nome para o novo payload
        const newNodeMap: { [key: string]: string } = {};
        nodes.forEach((node: any) => {
          newNodeMap[node._id] = node.name;
        });

        // identificar nodes que tiveram seus nomes alterados
        const renamedNodes: { oldName: string; newName: string }[] = [];
        for (const nodeId in existingNodeMap) {
          if (newNodeMap[nodeId] && existingNodeMap[nodeId] !== newNodeMap[nodeId]) {
            renamedNodes.push({
              oldName: existingNodeMap[nodeId],
              newName: newNodeMap[nodeId],
            });
          }
        }

        // atualizar os edges se houver renomeaçao de nodes
        if (renamedNodes.length > 0) {
          // atualizar cada edge que referencie os nomes antigos
          edges.forEach((edge: any) => {
            renamedNodes.forEach(({ oldName, newName }) => {
              if (edge.source === oldName) {
                edge.source = newName;
              }
              if (edge.target === oldName) {
                edge.target = newName;
              }
            });
          });
        }

        // update o roadmap com os novos dados
        existingRoadmap.name = name;
        existingRoadmap.nameSlug = nameSlug;
        existingRoadmap.imageURL = imageURL;
        existingRoadmap.imageAlt = imageAlt;
        existingRoadmap.nodes = nodes;
        existingRoadmap.edges = edges;

        await existingRoadmap.save();

        res.status(200).json({ message: 'Roadmap atualizado com sucesso.', roadmap: existingRoadmap });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar roadmap.', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
