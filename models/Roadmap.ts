import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IPosition {
  x: number;
  y: number;
}

export interface IContent {
  _id: Types.ObjectId; // ID gerado automaticamente
  type: 'vídeo' | 'website';
  title: string;
  url: string;
}

export interface INode {
  _id: Types.ObjectId;
  name: string;
  description: string;
  contents: IContent[];
  position: IPosition;
}

export interface IEdge {
  _id: any;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface IRoadmap extends Document {
  _id: Types.ObjectId;
  name: string;
  nameSlug: string;
  imageURL: string;
  imageAlt: string;
  nodes: INode[];
  edges: IEdge[];
}

const PositionSchema = new Schema<IPosition>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const ContentSchema = new Schema<IContent>({
  _id: { type: Schema.Types.ObjectId, auto: true }, // ID gerado automaticamente pelo MongoDB
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
});

const NodeSchema = new Schema<INode>({
  _id: { type: Schema.Types.ObjectId, auto: true }, // ID gerado automaticamente para o node
  name: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  contents: {
    type: [ContentSchema],
    validate: {
      validator: (v: IContent[]) => v.length > 0,
      message: 'Pelo menos um conteúdo é obrigatório.',
    },
    required: true,
  },
  position: PositionSchema,
});

const EdgeSchema = new Schema<IEdge>({
  source: {
    type: String,
    required: [true, 'A fonte da aresta é obrigatória.'],
  },
  target: {
    type: String,
    required: [true, 'O destino da aresta é obrigatório.'],
  },
  sourceHandle: {
    type: String,
  },
  targetHandle: {
    type: String,
  },
});

const RoadmapSchema: Schema<IRoadmap> = new Schema<IRoadmap>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório.'],
      trim: true,
    },
    nameSlug: {
      type: String,
      required: [true, 'O slug do nome é obrigatório.'],
      unique: true,
    },
    imageURL: {
      type: String,
      required: [true, 'A URL da imagem é obrigatório.'],
    },
    imageAlt: {
      type: String,
      required: [true, 'O texto alternativo da imagem é obrigatório.'],
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
  },
  {
    timestamps: true,
  }
);

const Roadmap: Model<IRoadmap> = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
