const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { checkUser } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

require("dotenv").config();

const app = express();

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//connect to database
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.log(err));

// view engine

app.set("view engine", "ejs");

app.get("*", checkUser);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page" });
});

// ** blog Routes
app.use("/blogs", blogRoutes);
app.use(authRoutes);

// cookies
// app.get("/set-cookies", (req, res) => {
//
//**below is an example of setting cookies without a cookie-parser */
// !!res.setHeader('Set-Cookie', 'newUser=true');

//   res.cookie("newUser", false);
//   res.cookie("isEmployee", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   });

//   res.send("you got the cookies!");
// });

// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//   res.json(cookies);
// });

app.use((req, res) => {
  res.status(404).render("404", { title: "Lost Page" });
});
