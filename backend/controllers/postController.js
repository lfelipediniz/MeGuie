const PostModel = require("../models/Post");
const NotificationModel = require("../models/Notification");
const fs = require('fs');
const fetch = require('node-fetch');

const sendPushNotification = async (expoPushToken, message) => {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: 'Nova curtida',
      body: 'Alguém curtiu sua publicação',
    }),
  });

  const data = await response.json();
  console.log(data);
};

const postController = {
  create: async (req, res) => {
    try {
      const file = req.file;
      const { userId, text } = req.body;

      const imageSrc = file ? file.path : null;

      const post = {
        user: userId,
        text: text,
        imageSrc: imageSrc,
      };

      const response = await PostModel.create(post);

      res.status(201).json({ response, msg: "Post criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao criar post." });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { userId, text } = req.body;
      const file = req.file;

      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      if (file) {
        if (post.imageSrc) {
          fs.unlinkSync(post.imageSrc);
        }
        post.imageSrc = file.path;
      }

      post.text = text;
      post.user = userId;

      const updatedPost = await post.save();

      res.status(200).json({ updatedPost, msg: "Post atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao atualizar post." });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const post = await PostModel.findById(id);

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      if (post.imageSrc) {
        fs.unlinkSync(post.imageSrc);
      }

      await PostModel.findByIdAndDelete(id);

      res.status(200).json({ msg: "Post excluído com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao excluir post." });
    }
  },

  getAll: async (req, res) => {
    try {
      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name positionCompany imageSrc');

      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Erro ao buscar os posts.' });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const post = await PostModel.findById(id).populate('user', 'name positionCompany imageSrc');

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao buscar post." });
    }
  },

  getPostsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await PostModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name positionCompany imageSrc');

      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  toggleLike: async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.body.userId;

      const post = await PostModel.findById(id).populate('user'); // Popula o campo 'user' para acessar o dono do post

      if (!post) {
        res.status(404).json({ msg: "Post não encontrado." });
        return;
      }

      const likeIndex = post.likes.indexOf(userId);

      let notificationMessage = '';

      if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
        notificationMessage = 'curtiu sua publicação';
      }

      const updatedPost = await post.save();

      // Envia a notificação para o dono do post se a ação foi "curtir" e não é o próprio usuário
      const postOwner = post.user;

      if (postOwner.expoPushToken && notificationMessage !== '' && postOwner._id.toString() !== userId) {
        await sendPushNotification(postOwner.expoPushToken, notificationMessage);

        // Cria a notificação no banco de dados
        const notification = {
          user: userId, // Usuário que curtiu
          postId: post._id, // ID do post
          userId: postOwner._id, // ID do usuário dono do post (quem receberá a notificação)
          text: notificationMessage,
        };

        await NotificationModel.create(notification); // Cria a notificação
      }

      res.status(200).json({ updatedPost, msg: "Likes alterado com sucesso." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = postController;