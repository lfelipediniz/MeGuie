// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import User, { IUser } from "../../models/User";
import bcrypt from "bcryptjs";

type Data = {
  message: string;
  userId?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método HTTP não permitido." });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    await dbConnect();

    // ve se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso." });
    }

    // hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // retornar o ID do novo usuário convertido para string
    return res
      .status(201)
      .json({
        message: "Usuário cadastrado com sucesso.",
        userId: newUser._id.toString(),
      });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res
      .status(500)
      .json({
        message: "Erro interno do servidor.",
        error: "Internal Server Error",
      });
  }
}
