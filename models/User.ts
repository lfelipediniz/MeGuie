// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface para o documento do usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Definição do esquema do usuário
const UserSchema: Schema<IUser> = new Schema<IUser>({
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
}, {
  timestamps: true,
});

// Verifica se o modelo já foi compilado para evitar recompilações
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;