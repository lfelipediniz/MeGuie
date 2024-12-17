// pages/api/favorite-roadmaps.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '../../models/User';
import mongoose from 'mongoose';

type Data = {
  favoriteRoadmapIds?: mongoose.Types.ObjectId[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  await dbConnect();

  try {

    if (req.method === 'GET') {
      const users: IUser[] = await User.find({}, 'favoriteRoadmaps');

      const favoriteRoadmapIds = users.flatMap(user => user.favoriteRoadmaps);

      // remove IDs duplicados convertendo o Set para um array
      const uniqueFavoriteRoadmapIds = Array.from(new Set(favoriteRoadmapIds.map(id => id.toString())));
      
      const uniqueFavoriteRoadmapObjectIds = uniqueFavoriteRoadmapIds.map(id => new mongoose.Types.ObjectId(id));
      res.status(200).json({ favoriteRoadmapIds: uniqueFavoriteRoadmapObjectIds });
    
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ error: `Método ${req.method} não permitido` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
