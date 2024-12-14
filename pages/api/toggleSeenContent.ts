// /lib/toggleSeenContent.ts
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User';  // Ajuste o caminho se necessário
import Content from '../../models/Content';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

interface JwtPayload {
  userId: string;
}

export const toggleSeenContent = async (req: any, res: any) => {
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
  const { contentId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se o contentId já está na lista de vistos
    const isSeen = user.seenContents.includes(contentId);

    if (isSeen) {
      // Remove o conteúdo da lista de vistos
      user.seenContents = user.seenContents.filter(id => id.toString() !== contentId);
    } else {
      // Adiciona o conteúdo à lista de vistos
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({ message: 'Conteúdo não encontrado.' });
      }
      user.seenContents.push(contentId);
    }

    await user.save();
    res.status(200).json({ message: isSeen ? 'Conteúdo removido da lista de vistos.' : 'Conteúdo adicionado à lista de vistos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao alterar conteúdo visto.' });
  }
};
