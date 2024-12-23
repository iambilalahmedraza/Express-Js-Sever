import express from "express";
import dotenv from "dotenv";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const app = express();
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Posts API",
      version: "1.0.0",
      description: "API for managing posts",
    },
  },
  apis: ["./index.js"], // Adjust path based on your file structure
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

dotenv.config();

const PORT = process.env.port;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let posts = [
  { id: 1, title: "post 1" },
  { id: 2, title: "post 2" },
  { id: 3, title: "post 3" },
];

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Retrieve all posts
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of posts to retrieve
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 */
app.get("/api", (req, res) => {
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    return res.json(posts.slice(0, limit));
  }
  res.status(200).json(posts);
});

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Retrieve a single post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: A single post
 *       400:
 *         description: Post not found
 */
app.get("/api/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(400).json({ message: `Post Not Found At ${id}` });
  }
  res.status(200).json(post);
});

/**
 * @swagger
 * /api:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 */
app.post("/api", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
  };
  if (!newPost.title) {
    return res.status(400).json({ message: "please include a title" });
  }
  posts.push(newPost);
  res.status(201).json(posts);
});

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Update an existing post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
app.put("/api/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "not found" });
  }
  post.title = req.body.title;
  res.status(200).json(posts);
});

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
app.delete("/api/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.status(404).json({ message: "not found" });
  }
  posts = posts.filter((post) => post.id !== id);
  res.status(200).json(posts);
});

app.listen(PORT, () => {
  console.log(`App is Listening on PORT ${PORT} http://localhost:${PORT}`);
});
