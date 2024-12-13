const CommentModel = require("../models/Comment");
const PostModel = require("../models/Post");
const NotificationModel = require("../models/Notification");
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
      title: 'Novo comentário',
      body: `Alguém ${message}`,
    }),
  });

  const data = await response.json();
};

const commentController = {
  create: async (req, res) => {
    try {
      const { userId, postId, text } = req.body;

      const comment = {
        user: userId,
        postId: postId,
        text: text,
      };

      const response = await CommentModel.create(comment);

      // Busca o post para obter o dono
      const post = await PostModel.findById(postId).populate('user');
      const postOwner = post.user;

      if (postOwner.expoPushToken && postOwner._id.toString() !== userId) {
        const notificationMessage = `comentou "${text}"`;
        
        await sendPushNotification(postOwner.expoPushToken, notificationMessage);

        // Cria a notificação no banco de dados
        const notification = {
          user: userId, // Usuário que comentou
          postId: post._id, // ID do post
          userId: postOwner._id, // ID do usuário dono do post (quem receberá a notificação)
          text: notificationMessage,
        };

        await NotificationModel.create(notification); // Cria a notificação
      }

      res.status(201).json({ response, msg: "Comentário criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao criar comentário." });
    }
  },

  getAll: async (req, res) => {
    try {
      const comments = await CommentModel.find().sort({ createdAt: -1 }).populate('user', 'name imageSrc');
      res.json(comments);
    } catch (error) {
      console.log(error);
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const comment = await CommentModel.findById(id).populate('user', 'name imageSrc');

      if (!comment) {
        res.status(404).json({ msg: "Comentário não encontrado." });
        return;
      }

      res.json(comment);
    } catch (error) {
      console.log(error);
    }
  },

  getCommentsByPost: async (req, res) => {
    try {
      const postId = req.params.postId;
      const comments = await CommentModel.find({ postId: postId }).sort({ createdAt: -1 }).populate('user', 'name imageSrc');

      res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  getCommentsByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const comments = await CommentModel.find({ user: userId }).sort({ createdAt: -1 }).populate('user', 'name imageSrc');

      res.status(200).json(comments);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const comment = await CommentModel.findById(id);

      if (!comment) {
        res.status(404).json({ msg: "Comentário não encontrado." });
        return;
      }

      const deletedComment = await CommentModel.findByIdAndDelete(id);

      res.status(200).json({ deletedComment, msg: "Comentário excluído com sucesso." });
    } catch (error) {
      console.log(error);
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const comment = {
      user: req.body.userId,
      postId: req.body.postId,
      text: req.body.text,
    };

    const updatedComment = await CommentModel.findByIdAndUpdate(id, comment, { new: true });

    if (!updatedComment) {
      res.status(404).json({ msg: "Comentário não encontrado." });
      return;
    }

    res.status(200).json({ updatedComment, msg: "Comentário atualizado com sucesso." });
  },
};

module.exports = commentController;
