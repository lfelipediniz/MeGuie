// /pages/api/content.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Content, { IContent } from '../../models/Content';
import User from '../../models/User';

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
    // GET: Lista todos os conteúdos
    case 'GET':
      try {
        const contents = await Content.find();
        res.status(200).json(contents);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar conteúdos.' });
      }
      break;

    // POST: Cria um novo conteúdo
    case 'POST':
      try {
        const { title, videos, websites } = body;

        if (!title) {
          return res.status(400).json({ message: 'O título é obrigatório.' });
        }

        const newContent = new Content({ title, videos, websites });
        await newContent.save();

        res.status(201).json({ message: 'Conteúdo criado com sucesso.', content: newContent });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar conteúdo.' });
      }
      break;

    // PUT: Atualiza um conteúdo existente
    case 'PUT':
      try {
        const { id } = query;
        const { title, videos, websites } = body;

        const updatedContent = await Content.findByIdAndUpdate(
          id,
          { title, videos, websites },
          { new: true, runValidators: true }
        );

        if (!updatedContent) {
          return res.status(404).json({ message: 'Conteúdo não encontrado.' });
        }

        res.status(200).json({ message: 'Conteúdo atualizado com sucesso.', content: updatedContent });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar conteúdo.' });
      }
      break;

    // DELETE: Deleta um conteúdo existente
    case 'DELETE':
      try {
        const { id } = query;

        const deletedContent = await Content.findByIdAndDelete(id);

        if (!deletedContent) {
          return res.status(404).json({ message: 'Conteúdo não encontrado.' });
        }

        res.status(200).json({ message: 'Conteúdo deletado com sucesso.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar conteúdo.' });
      }
      break;

    // Método não permitido
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
