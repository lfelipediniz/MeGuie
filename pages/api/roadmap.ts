import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Roadmap, { IRoadmap } from '../../models/Roadmap';

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
    // GET: Lista todos ou um roadmap específico se for passado nome na query
    case 'GET':
      try {
        const { name } = query;

        if (name) {
          // Buscar por nome específico
          const roadmap = await Roadmap.findOne({ name: name.toString() });
          if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap não encontrado.' });
          }
          return res.status(200).json(roadmap);
        }

        // Se não for passado nome, retorna todos
        const roadmaps = await Roadmap.find();
        res.status(200).json(roadmaps);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar roadmaps.' });
      }
      break;

    // POST: Cria um novo roadmap a partir de um JSON com name, nodes (com contents embutidos) e edges
    case 'POST':
      try {
        const { name, nodes, edges } = body;

        if (!name) {
          return res.status(400).json({ message: 'O nome é obrigatório.' });
        }

        if (!Array.isArray(nodes) || nodes.length === 0) {
          return res.status(400).json({ message: 'É necessário adicionar pelo menos um node.' });
        }

        // Valida cada node
        for (const node of nodes) {
          if (!node.name || !node.description || !node.contents || !node.position) {
            return res.status(400).json({ message: 'Cada node deve conter name, description, contents e position.' });
          }

          if (!Array.isArray(node.contents) || node.contents.length === 0) {
            return res.status(400).json({ message: `O node ${node.name} deve conter ao menos um conteúdo.` });
          }

          for (const content of node.contents) {
            if (!content.type || !content.title || !content.url) {
              return res.status(400).json({ message: `Cada conteúdo do node ${node.name} deve ter type, title e url.` });
            }
          }
        }

        if (!Array.isArray(edges)) {
          return res.status(400).json({ message: 'É necessário enviar o array de edges (mesmo que vazio).' });
        }

        const newRoadmap = new Roadmap({ name, nodes, edges });
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
        const { name, nodes, edges } = body;

        // Pode adicionar validações semelhantes às do POST se necessário
        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
          id,
          { name, nodes, edges },
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
