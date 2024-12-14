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
    // GET: Lista todos os roadmaps com os nodes e conteúdos populados
    case 'GET':
      try {
        const roadmaps = await Roadmap.find().populate({
          path: 'nodes.contents',
          model: 'Content',
        });
        res.status(200).json(roadmaps);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar roadmaps.' });
      }
      break;

    // POST: Cria um novo roadmap
    case 'POST':
      try {
        const { name, nodes } = body;

        if (!name) {
          return res.status(400).json({ message: 'O nome é obrigatório.' });
        }

        // Valida que os nodes estão sendo passados corretamente
        if (!Array.isArray(nodes) || nodes.length === 0) {
          return res.status(400).json({ message: 'É necessário adicionar pelo menos um node.' });
        }

        // Cria o novo roadmap
        const newRoadmap = new Roadmap({ name, nodes });
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
        const { name, nodes } = body;

        // Verifica se o roadmap existe
        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
          id,
          { name, nodes },
          { new: true, runValidators: true }
        ).populate({
          path: 'nodes.contents',
          model: 'Content',
        });

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
