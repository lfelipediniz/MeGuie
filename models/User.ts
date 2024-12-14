import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Interface para conteúdos vistos agrupados por roadmapId
interface ISeenRoadmapContents {
  roadmapId: Types.ObjectId;
  contentIds: Types.ObjectId[];
}

// Interface para o documento do usuário
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  favoriteRoadmaps: Types.ObjectId[];       // Array de IDs de roadmaps favoritos
  seenContents: ISeenRoadmapContents[];      // Array de conteúdos vistos agrupados por roadmapId
}

// Definição do esquema de conteúdos vistos agrupados por roadmapId
const SeenRoadmapContentsSchema = new Schema<ISeenRoadmapContents>({
  roadmapId: {
    type: Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true,
  },
  contentIds: {
    type: [Types.ObjectId],
    required: true,
    default: [],
  },
});

// Definição do esquema do usuário
const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-mail é obrigatório.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória.'],
    },
    admin: {
      type: Boolean,
      default: false,
      select: false, // Não retornar por padrão em consultas
    },
    favoriteRoadmaps: {
      type: [Types.ObjectId],
      ref: 'Roadmap',
      default: [],
    },
    seenContents: {
      type: [SeenRoadmapContentsSchema], // Array de conteúdos vistos agrupados por roadmapId
      default: [],
    },
  },
  {
    timestamps: true, // Adiciona campos de criação e atualização automaticamente
  }
);

// Verifica se o modelo já foi compilado para evitar recompilações
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
