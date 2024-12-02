// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string; // Pegando a URL de conexão do MongoDB

// Verifica se a URL de conexão existe
if (!MONGODB_URI) {
  throw new Error('Defina a variável de ambiente MONGODB_URI no arquivo .env');
}

interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare global {
  var mongoose: MongooseGlobal['mongoose'];
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
