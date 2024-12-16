import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Roadmap, { IRoadmap } from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, headers, body, query } = req;

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
    // GET: Lista todos os roadmaps ou um roadmap específico pelo slug na query
    case 'GET':
      try {
        const { name } = query;

        if (name) {
          const roadmap = await Roadmap.findOne({ nameSlug: name.toString().toLowerCase() });
          if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap não encontrado.' });
          }
          return res.status(200).json(roadmap);
        }

        const roadmaps = await Roadmap.find();
        res.status(200).json(roadmaps);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar roadmaps.' });
      }
      break;

    // POST: Cria um novo roadmap
    case 'POST':
      try {
        const { name, nameSlug, imageURL, imageAlt, nodes, edges } = body;

        if (!name || !nameSlug || !imageURL || !imageAlt) {
          return res.status(400).json({ message: 'Os campos nome, nameSlug, imageURL e imageAlt são obrigatórios.' });
        }

        if (!Array.isArray(nodes) || nodes.length === 0) {
          return res.status(400).json({ message: 'É necessário adicionar pelo menos um node.' });
        }

        // Verificar se todos os nomes dos nós são únicos
        const nodeNames = nodes.map((node: any) => node.name.trim().toLowerCase());
        const uniqueNodeNames = new Set(nodeNames);
        if (uniqueNodeNames.size !== nodeNames.length) {
          return res.status(400).json({ message: 'Os nomes dos nodes devem ser únicos dentro do roadmap.' });
        }

        const newRoadmap = new Roadmap({ name, nameSlug, imageURL, imageAlt, nodes, edges });
        await newRoadmap.save();

        res.status(201).json({ message: 'Roadmap criado com sucesso.', roadmap: newRoadmap });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar roadmap.' });
      }
      break;

    // PUT: Atualiza um roadmap existente
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

        // Verificar se todos os nomes dos nós são únicos
        const nodeNamesUpdate = nodes.map((node: any) => node.name.trim().toLowerCase());
        const uniqueNodeNamesUpdate = new Set(nodeNamesUpdate);
        if (uniqueNodeNamesUpdate.size !== nodeNamesUpdate.length) {
          return res.status(400).json({ message: 'Os nomes dos nodes devem ser únicos dentro do roadmap.' });
        }

        // Atualizar o roadmap
        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
          id,
          { name, nameSlug, imageURL, imageAlt, nodes, edges },
          { new: true, runValidators: true }
        );

        if (!updatedRoadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }

        res.status(200).json({ message: 'Roadmap atualizado com sucesso.', roadmap: updatedRoadmap });
      } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar roadmap.', error: error.message });
      }
      break;

    // DELETE: Deleta um roadmap existente
    case 'DELETE':
      try {
        const { id } = query;

        const deletedRoadmap = await Roadmap.findByIdAndDelete(id);

        if (!deletedRoadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }

        res.status(200).json({ message: 'Roadmap deletado com sucesso.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar roadmap.' });
      }
      break;

    // Método não permitido
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
