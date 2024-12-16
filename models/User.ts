import mongoose, { Document, Model, Schema } from 'mongoose';

//
// Interfaces
//

// Interface para conteúdos
interface IContent extends Document {
  _id: string;
  type: 'video' | 'website';
  title: string;
  url: string;
}

// Interface para nodes
interface INode extends Document {
  _id: string;
  name: string;
  description: string;
  contents: string[]; // Referência para os conteúdos (IDs como strings)
}

// Interface para conteúdos vistos agrupados por nodeId
interface ISeenNodeContents {
  nodeId: string;
  contentIds: string[];
}

// Interface para conteúdos vistos agrupados por roadmapId
interface ISeenRoadmapContents {
  roadmapId: string;
  nodes: ISeenNodeContents[];
}

// Interface para o documento do usuário
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  favoriteRoadmaps: string[];         // Array de IDs de roadmaps favoritos
  seenContents: ISeenRoadmapContents[]; // Array de conteúdos vistos agrupados por roadmapId e nodeId
}

//
// Esquemas
//

// Esquema para conteúdos
const ContentSchema = new Schema<IContent>({
  type: {
    type: String,
    enum: ['video', 'website'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Esquema para nodes
const NodeSchema = new Schema<INode>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contents: [{
    type: String,
    ref: 'Content', // Referência para o modelo 'Content'
  }],
});

// Esquema para conteúdos vistos agrupados por nodeId
const SeenNodeContentsSchema = new Schema<ISeenNodeContents>({
  nodeId: {
    type: String,
    ref: 'Node', // Referência para o modelo 'Node'
    required: true,
  },
  contentIds: {
    type: [String],
    ref: 'Content', // Referência para o modelo 'Content'
    required: true,
    default: [],
  },
});

// Esquema para conteúdos vistos agrupados por roadmapId
const SeenRoadmapContentsSchema = new Schema<ISeenRoadmapContents>({
  roadmapId: {
    type: String,
    ref: 'Roadmap', // Referência para o modelo 'Roadmap'
    required: true,
  },
  nodes: {
    type: [SeenNodeContentsSchema],
    required: true,
    default: [],
  },
});

// Esquema para o usuário
const UserSchema = new Schema<IUser>({
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
    select: false,
  },
  favoriteRoadmaps: {
    type: [String],
    ref: 'Roadmap', // Referência para o modelo 'Roadmap'
    default: [],
  },
  seenContents: {
    type: [SeenRoadmapContentsSchema],
    default: [],
  },
});

//
// Compilação dos Modelos
//

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
const Node: Model<INode> = mongoose.models.Node || mongoose.model<INode>('Node', NodeSchema);
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

//
// Exportação dos Modelos
//

export { Content, Node, User };
export default User;
