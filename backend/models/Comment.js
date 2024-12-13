const mongoose = require("mongoose")

const { Schema } = mongoose

const commentSchema = new Schema(
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
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment;