const NotificationModel = require("../models/Notification");

const notificationController = {
  // Criação de uma notificação
  create: async (req, res) => {
    try {
      const notification = {
        user: req.body.user, // ID do usuário que curtiu ou comentou
        postId: req.body.postId, // ID do post onde a ação ocorreu
        userId: req.body.userId, // ID do usuário que receberá a notificação
        text: req.body.text, // Texto da notificação
      };

      const response = await NotificationModel.create(notification);

      res.status(201).json({ response, msg: "Notificação criada com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao criar notificação." });
    }
  },

  // Listagem de notificações para um usuário específico
  get: async (req, res) => {
    try {
      const userId = req.params.userId;
      const notifications = await NotificationModel.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name imageSrc'); // Popula os dados do usuário que realizou a ação

      res.status(200).json(notifications);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao buscar notificações." });
    }
  },
};

module.exports = notificationController;
