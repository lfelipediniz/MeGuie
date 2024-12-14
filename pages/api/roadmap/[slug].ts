import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Roadmap, { IRoadmap } from '@/models/Roadmap';

// Função auxiliar para converter o slug em um nome com acentos
const slugToName = (slug: string): string => {
  const mapSlugs: Record<string, string> = {
    biologia: 'Biologia',
    quimica: 'Química',
    matematica: 'Matemática',
    sociologia: 'Sociologia',
    portugues: 'Português',
  };

  return mapSlugs[slug] || '';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Slug inválido.' });
  }

  // Conectar ao banco de dados
  await dbConnect();

  try {
    // Converter o slug para o nome original com acentos
    const roadmapName = slugToName(slug);

    if (!roadmapName) {
      return res.status(404).json({ message: 'Roadmap não encontrado.' });
    }

    // Buscar o roadmap pelo nome
    const roadmap: IRoadmap | null = await Roadmap.findOne({ name: roadmapName });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap não encontrado no banco de dados.' });
    }

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('Erro ao buscar o roadmap:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
