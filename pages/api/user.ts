// /pages/api/user.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';
import jwt from 'jsonwebtoken';

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

  switch (method) {
    case 'GET':
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Token de autenticação inválido.' });
        }

        const token = authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET as string;

        const decoded = jwt.verify(token, secret) as JwtPayload;

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${method} não permitido.`);
      break;
  }
}
