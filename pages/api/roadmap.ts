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
    // GET: Lista todos ou um roadmap específico se for passado o slug na query
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
        const { name, nameSlug, nodes, edges } = body;

        if (!name || !nameSlug) {
          return res.status(400).json({ message: 'O nome e o slug do nome são obrigatórios.' });
        }

        if (!Array.isArray(nodes) || nodes.length === 0) {
          return res.status(400).json({ message: 'É necessário adicionar pelo menos um node.' });
        }

        const newRoadmap = new Roadmap({ name, nameSlug, nodes, edges });
        await newRoadmap.save();

        res.status(201).json({ message: 'Roadmap criado com sucesso.', roadmap: newRoadmap });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar roadmap.' });
      }
      break;

    // PUT: Atualiza um roadmap existente
    case 'PUT':
      try {
        const { id } = query;
        const { name, nameSlug, nodes, edges } = body;

        if (!name || !nameSlug) {
          return res.status(400).json({ message: 'O nome e o slug do nome são obrigatórios.' });
        }

        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
          id,
          { name, nameSlug, nodes, edges },
          { new: true, runValidators: true }
        );

        if (!updatedRoadmap) {
          return res.status(404).json({ message: 'Roadmap não encontrado.' });
        }

        res.status(200).json({ message: 'Roadmap atualizado com sucesso.', roadmap: updatedRoadmap });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar roadmap.' });
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
