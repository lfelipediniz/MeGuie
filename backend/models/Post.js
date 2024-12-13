const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true, 
    },
    imageSrc: {
      type: String,
      required: false, 
    },
    text: {
      type: String,
      required: true, 
    },
    likes: {
      type: [String],
      default: [], 
      required: false, 
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
