// /lib/toggleFavorite.ts
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User';  // Ajuste o caminho se necessário
import Roadmap from '../../models/Roadmap';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

interface JwtPayload {
  userId: string;
}

export const toggleFavorite = async (req: any, res: any) => {
  await connectDB();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação inválido.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET as string;

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  const { userId } = decoded;
  const { roadmapId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o roadmapId já está nos favoritos
    const isFavorite = user.favoriteRoadmaps.includes(roadmapId);

    if (isFavorite) {
      // Remove o roadmap da lista de favoritos
      user.favoriteRoadmaps = user.favoriteRoadmaps.filter(id => id.toString() !== roadmapId);
    } else {
      // Adiciona o roadmap à lista de favoritos
      const roadmap = await Roadmap.findById(roadmapId);
      if (!roadmap) {
        return res.status(404).json({ message: 'Roadmap não encontrado.' });
      }
      user.favoriteRoadmaps.push(roadmapId);
    }

    await user.save();
    res.status(200).json({ message: isFavorite ? 'Roadmap removido dos favoritos.' : 'Roadmap adicionado aos favoritos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao alterar favorito.' });
  }
};
