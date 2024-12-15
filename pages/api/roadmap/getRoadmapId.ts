import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Roadmap from '@/models/Roadmap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, query } = req;

  if (method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).end(`Método ${method} não permitido.`);
  }

  try {
    const { nameSlug } = query;

    if (!nameSlug || typeof nameSlug !== 'string') {
      return res.status(400).json({ message: 'O nameSlug é obrigatório e deve ser uma string.' });
    }

    // Buscar o roadmap pelo nameSlug
    const roadmap = await Roadmap.findOne({ nameSlug });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap não encontrado.' });
    }

    // Retornar apenas o _id do roadmap
    res.status(200).json({ _id: roadmap._id });
  } catch (error) {
    console.error('Erro ao buscar o roadmap:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
