const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", title: "", snippet: "", body: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "Invalid Email or Password";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.title = "That title is already taken";
    return errors;
  }

  // validation errors
  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { blogs: result, title: "All blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
      res.render("404", { title: "Blog not found" });
    });
};

const blog_create_get = (req, res) => {
  res.render("create", { title: "Create a new blog" });
};

const blog_create_post = (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.redirect("/log-in");
      } else {
        let user = await User.findById(decodedToken.id);
        const newBlog = { ...req.body, ...{ user: user.email } };
        const blog = new Blog(newBlog);
        blog
          .save()
          .then((result) => {
            res.json({ blog: result });
          })
          .catch((err) => {
            console.log(err);
            const errors = handleErrors(err);
            res.json({ errors });
          });
      }
    });
  } else {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
};
