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

app.use((req, res) => {
  res.status(404).render("404", { title: "Lost Page" });
});
