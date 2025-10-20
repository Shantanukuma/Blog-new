require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();

// Use PORT from environment (Vercel) or fallback to 8000
const PORT = process.env.PORT || 8000;

// Use MongoDB Atlas URL from environment
const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;
async function connectToMongDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log(`❌ MongoDB connection error: ${error}`);
  }
}

app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongDb();
  }
  next();
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
module.exports = app
