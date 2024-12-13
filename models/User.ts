// /models/User.ts

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Interface para o documento do usuário
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

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
  },
  {
    timestamps: true,
  }
);

// Verifica se o modelo já foi compilado para evitar recompilações
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
