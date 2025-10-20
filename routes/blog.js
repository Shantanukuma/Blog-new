// const { Router } = require("express");
// const Blog = require("../models/blog");
// const Comment = require("../models/comment");
// const router = Router();
// // const multer = require("multer");
// const path = require("path");
// const { put } = require('@vercel/blob');

// router.get("/add-new", (req, res) => {
//   res.render("addBlog", {
//     user: req.user,
//   });
// });

// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     return cb(null, path.resolve(`./public/uploads`));
// //   },
// //   filename: function (req, file, cb) {
// //     return cb(null, `${Date.now()}-${file.originalname}`);
// //   },
// // });
// // const upload = multer({ storage });

// router.get("/:id", async (req, res) => {
//   const blog = await Blog.findById(req.params.id).populate("createdBy");
//   const comments = await Comment.find({ blogId: req.params.id}).populate(
//     "createdBy"
//   )

//   res.render("blog", {
//     blog,
//     user: req.user,
//     comments
//   });
// });
// router.post("/comment/:blogId", async (req, res) => {
//   const comment = await Comment.create({
//     content: req.body.content,
//     blogId: req.params.blogId,
//     createdBy: req.user._id,
//   });
//   return res.redirect(`/blog/${req.params.blogId}`);
// });

// // router.post("/", upload.single("coverImageURL"), async (req, res) => {

// //   const { title, body } = req.body;
// //   const blog = await Blog.create({
// //     title,
// //     body,
// //     createdBy: req.user._id,
// //     coverImageURL: `/uploads/${req.file.filename}`,
// //   });
// //   return res.redirect(`/blog/${blog._id}`);
// // });

// router.post("/", async (req, res) => {  // No upload.single() here
//   const { title, body } = req.body;
//   let coverImageURL = null;

//   // Handle file upload manually (since multer won't work)
//   if (req.files && req.files.coverImageURL) {  // Assuming you're using express-fileupload or similar; adjust if needed
//     const file = req.files.coverImageURL;
//     const blob = await put(`uploads/${Date.now()}-${file.name}`, file.data, { access: 'public' });
//     coverImageURL = blob.url;  // This is a public URL
//   }

//   const blog = await Blog.create({
//     title,
//     body,
//     createdBy: req.user._id,
//     coverImageURL,  // Now a cloud URL
//   });
//   return res.redirect(`/blog/${blog._id}`);
// });

// module.exports = router;




// // const { put } = require('@vercel/blob');  // Add this import
// // // Remove multer.diskStorage and storage config

// // router.post("/", async (req, res) => {  // No upload.single() here
// //   const { title, body } = req.body;
// //   let coverImageURL = null;

// //   // Handle file upload manually (since multer won't work)
// //   if (req.files && req.files.coverImageURL) {  // Assuming you're using express-fileupload or similar; adjust if needed
// //     const file = req.files.coverImageURL;
// //     const blob = await put(`uploads/${Date.now()}-${file.name}`, file.data, { access: 'public' });
// //     coverImageURL = blob.url;  // This is a public URL
// //   }

// //   const blog = await Blog.create({
// //     title,
// //     body,
// //     createdBy: req.user._id,
// //     coverImageURL,  // Now a cloud URL
// //   });
// //   return res.redirect(`/blog/${blog._id}`);
// // });




const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { put } = require("@vercel/blob");

const router = Router();

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

// View a single blog with comments
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

  res.render("blog", {
    blog,
    user: req.user,
    comments,
  });
});

// Post a new comment
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

// Create a new blog post (with optional image upload)
router.post("/", async (req, res) => {
  const { title, body } = req.body;
  let coverImageURL = null;

  if (req.files && req.files.coverImageURL) {
    const file = req.files.coverImageURL;
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file.data, {
      access: "public",
    });
    coverImageURL = blob.url;
  }

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL,
  });

  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
