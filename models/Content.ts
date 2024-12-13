import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Tipos para vídeos e sites
type Video = {
  title: string;
  url: string;
  seen: boolean;
};

type Website = {
  title: string;
  url: string;
  seen: boolean;
};

// Interface para o documento de conteúdo
export interface IContent extends Document {
  _id: Types.ObjectId;
  title: string;
  videos: Video[];
  websites: Website[];
}

// Definição do esquema de conteúdo
const ContentSchema: Schema<IContent> = new Schema<IContent>(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório.'],
      trim: true,
    },
    videos: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        seen: { type: Boolean, default: false },
      },
    ],
    websites: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        seen: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Verifica se o modelo já foi compilado para evitar recompilações
const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
