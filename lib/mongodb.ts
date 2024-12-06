// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;
console.log('MONGODB_URI:', MONGODB_URI); // Log da variável de ambiente

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

/**
 * Verifica se já existe uma conexão Mongoose
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Usando conexão Mongoose cacheada.');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Estabelecendo nova conexão Mongoose...');
    const opts = {
      bufferCommands: false,
      // Adicione outras opções conforme necessário
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Conexão Mongoose estabelecida.');
      return mongoose;
    }).catch((error) => {
      console.error('Erro ao conectar no MongoDB:', error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
