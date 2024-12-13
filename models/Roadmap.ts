import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import Content, { IContent } from './Content'; // Importe o modelo e a interface Content

// Interface para o documento de Roadmap
export interface IRoadmap extends Document {
  _id: Types.ObjectId;
  title: string;
  contents: Types.ObjectId[] | IContent[];
}

// Definição do esquema de Roadmap
const RoadmapSchema: Schema<IRoadmap> = new Schema<IRoadmap>(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório.'],
      trim: true,
    },
    contents: [
      {
        type: Types.ObjectId,
        ref: 'Content', // Referência ao modelo Content
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Verifica se o modelo já foi compilado para evitar recompilações
const Roadmap: Model<IRoadmap> = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;