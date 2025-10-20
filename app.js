// require("dotenv").config();

// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");

// const userRoute = require("./routes/user");
// const blogRoute = require("./routes/blog");
// const Blog = require("./models/blog");
// const {
//   checkForAuthenticationCookie,
// } = require("./middlewares/authentication");

// const app = express();

// // Use PORT from environment (Vercel) or fallback to 8000
// const PORT = process.env.PORT || 8000;

// // Use MongoDB Atlas URL from environment
// const MONGO_URL = process.env.MONGO_URL;

// async function connectToMongoDB() {
//   if (cachedConnection) return cachedConnection;
//   try {
//     cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");
//     return cachedConnection;
//   } catch (error) {
//     console.error("❌ MongoDB error:", error);
//     throw error;
//   }
// }

// await connectToMongoDB();

// app.use(fileUpload());
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(checkForAuthenticationCookie("token"));
// app.use(express.static(path.resolve("./public")));

// // Routes
// app.get("/", async (req, res) => {
//   const allBlogs = await Blog.find({});
//   res.render("home", {
//     user: req.user,
//     blogs: allBlogs,
//   });
// });

// app.use("/user", userRoute);
// app.use("/blog", blogRoute);

// app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

// try {
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Something broke!");
//   });
// } catch (error) {
//   console.log("error occuared", error);
// }
// module.exports = app;



// import "dotenv/config";  // ES module way to load dotenv
// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";  // Add this import

// import userRoute from "./routes/user.js";  // Add .js extension for ES modules
// import blogRoute from "./routes/blog.js";
// import Blog from "./models/blog.js";
// import { checkForAuthenticationCookie } from "./middlewares/authentication.js";

// const app = express();

// // Use PORT from environment (Vercel) or fallback to 8000
// const PORT = process.env.PORT || 8000;

// // Use MongoDB Atlas URL from environment
// const MONGO_URL = process.env.MONGO_URL;

// let cachedConnection = null;  // Declare this here

// async function connectToMongoDB() {
//   if (cachedConnection) return cachedConnection;
//   try {
//     cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");
//     return cachedConnection;
//   } catch (error) {
//     console.error("❌ MongoDB error:", error);
//     throw error;
//   }
// }

// await connectToMongoDB();  // This is fine in ES modules

// app.use(fileUpload());
// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(checkForAuthenticationCookie("token"));
// app.use(express.static(path.resolve("./public")));

// // Routes
// app.get("/", async (req, res) => {
//   const allBlogs = await Blog.find({});
//   res.render("home", {
//     user: req.user,
//     blogs: allBlogs,
//   });
// });

// app.use("/user", userRoute);
// app.use("/blog", blogRoute);

// // Error handling middleware (no try-catch needed)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

// export default app;  // ES module export




require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // still useful for local testing

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();

// Use PORT from environment (Vercel) or fallback to 8000
const PORT = process.env.PORT || 8000;

// MongoDB connection
let cachedConnection = null;

async function connectToMongoDB() {
  if (cachedConnection) return cachedConnection;
  try {
    cachedConnection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
    return cachedConnection;
  } catch (error) {
    console.error("❌ MongoDB error:", error);
    throw error;
  }
}

// Connect to MongoDB
(async () => {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
})();

// Middlewares
app.use(fileUpload()); // optional for local uploads
app.use(express.json()); // parse JSON (needed for Blob uploads)
app.use(express.urlencoded({ extended: false })); // parse form data
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Vercel Serverless export
module.exports = app;
