const express = require("express");
const PostRouter = express.Router();
const Post = require("../models/post");
const User = require("../models/user");

PostRouter.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.user_id);
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }
    const post = new Post({
      ...req.body,
      user_id: user._id,
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

PostRouter.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

PostRouter.put("/:id", async (req, res) => {
  const allowedUpdates = ["content"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

PostRouter.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

PostRouter.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    post.likes++;
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

PostRouter.post("/:id/unlike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    post.likes = Math.max(post.likes - 1, 0);
    await post.save();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = PostRouter;
