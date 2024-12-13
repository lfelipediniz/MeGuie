const mongoose = require("mongoose")

const { Schema } = mongoose

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
    postId: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification;