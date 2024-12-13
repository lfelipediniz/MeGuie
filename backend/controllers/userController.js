const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const fs = require('fs');
require('dotenv').config();

const userController = {
  register: async (req, res) => {
    try {
      const { name, positionCompany, email, password, expoPushToken } = req.body;
      const file = req.file; // Recebe o arquivo da imagem, se fornecido

      // Verifica se o email já está em uso
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email já está em uso." });
      }

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Salva o caminho da imagem, se houver uma imagem enviada
      const imageSrc = file ? file.path : null;

      // Cria o novo usuário
      const newUser = new UserModel({
        name,
        imageSrc,
        positionCompany,
        email,
        password: hashedPassword,
        expoPushToken,
      });

      const response = await newUser.save();
      res.status(201).json({ response, msg: "Usuário criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao registrar usuário." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password, expoPushToken } = req.body;
  
      // Verifica se o usuário existe
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }
  
      // Verifica a senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Senha incorreta." });
      }
  
      // Atualiza o expoPushToken do usuário se necessário
      if (expoPushToken && expoPushToken !== user.expoPushToken) {
        user.expoPushToken = expoPushToken;
        await user.save();
      }
  
      // Cria o token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      // Retorna os dados do usuário junto com o token
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          positionCompany: user.positionCompany,
          imageSrc: user.imageSrc,
          expoPushToken: user.expoPushToken,
        },
        token,
        msg: "Login realizado com sucesso."
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao realizar login." });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await UserModel.find().sort({ name: 1 });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        res.status(404).json({ msg: "Usuário não encontrado." });
        return;
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao buscar usuário." });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        res.status(404).json({ msg: "Usuário não encontrado." });
        return;
      }

      // Remove a imagem do servidor se houver
      if (user.imageSrc) {
        fs.unlinkSync(user.imageSrc);
      }

      const deleteUser = await UserModel.findByIdAndDelete(id);

      res.status(200).json({ deleteUser, msg: "Usuário excluído com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao excluir usuário." });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, positionCompany, email, password, expoPushToken } = req.body;
      const file = req.file;
  
      const user = await UserModel.findById(id);
  
      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }
  
      // Atualiza apenas os campos fornecidos
      if (name) user.name = name;
      if (positionCompany) user.positionCompany = positionCompany;
      if (email) user.email = email;
  
      // Atualiza a senha se fornecida
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      // Atualiza o expoPushToken se fornecido
      if (expoPushToken) {
        user.expoPushToken = expoPushToken;
      }
  
      // Se uma nova imagem for enviada, remove a antiga e atualiza com a nova
      if (file) {
        if (user.imageSrc) {
          fs.unlinkSync(user.imageSrc);
        }
        user.imageSrc = file.path;
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({ updatedUser, msg: "Usuário atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao atualizar usuário." });
    }
  },  
};

module.exports = userController;
