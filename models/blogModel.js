const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please Enter A Title"],
      unique: true,
    },
    snippet: {
      type: String,
      required: [true, "Please Enter A Snippet"],
    },
    body: {
      type: String,
      required: [true, "Please Enter Body"],
    },
    user: {
      type: String,
      required: [true, "User Not Found, Login And try Again"],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
