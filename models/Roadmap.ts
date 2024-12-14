import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Interface para o documento do roadmap
export interface IRoadmap extends Document {
  _id: Types.ObjectId;
  name: string;
  nodes: Types.Array<{
    _id: Types.ObjectId;
    name: string;
    description: string;
    contents: Types.Array<Types.ObjectId>; // Array de referências ao modelo Conteudo
  }>;
}

// Definição do esquema do roadmap
const RoadmapSchema: Schema<IRoadmap> = new Schema<IRoadmap>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório.'],
      trim: true,
    },
    nodes: [
      {
        name: {
          type: String,
          required: [true, 'Nome do node é obrigatório.'],
        },
        description: {
          type: String,
          required: [true, 'Descrição é obrigatória.'],
          trim: true,
        },
        contents: [
          {
            type: Types.ObjectId,
            ref: 'Content', // Referência ao modelo Conteudo
            required: [true, 'Conteúdo é obrigatório.'],
          },
        ],
      },
    ],
  },
  {
    timestamps: true, // Adiciona campos de criação e atualização automaticamente
  }
);

// Verifica se o modelo já foi compilado para evitar recompilações
const Roadmap: Model<IRoadmap> = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
