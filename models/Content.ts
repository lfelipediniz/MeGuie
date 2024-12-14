import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Interface para o documento do conteúdo
export interface IContent extends Document {
  _id: Types.ObjectId;
  type: 'vídeo' | 'website';
  title: string;
  url: string;
}

// Definição do esquema do conteúdo
const ContentSchema: Schema<IContent> = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: ['vídeo', 'website'],
      required: [true, 'Tipo de conteúdo é obrigatório.'],
    },
    title: {
      type: String,
      required: [true, 'Título do conteúdo é obrigatório.'],
    },
    url: {
      type: String,
      required: [true, 'URL do conteúdo é obrigatória.'],
    },
  },
  {
    timestamps: true,
  }
);

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
