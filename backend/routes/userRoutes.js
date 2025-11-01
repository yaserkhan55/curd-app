import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const newUser = new User({ name, email, address });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});
router.put("/:id", async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
