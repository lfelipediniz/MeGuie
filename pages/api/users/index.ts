// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User, { IUser } from '../../../models/User';

type Data =
  | { message: string }
  | IUser[]
  | IUser;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users: IUser[] = await User.find({});
        res.status(200).json(users);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
      break;
    case 'POST':
      try {
        const { name, email } = req.body;
        const user = await User.create({ name, email });
        res.status(201).json(user);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
