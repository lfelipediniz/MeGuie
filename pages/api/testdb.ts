// pages/api/testdb.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ message: "Conexão estabelecida com sucesso!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}