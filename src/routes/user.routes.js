// user.routes.js

const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const { generateToken } = require("../auth/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/register/email", async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi bidang yang diperlukan
  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Username, email, and password are required",
    });
  }

  try {
    // Cek apakah email sudah digunakan
    const existingUserByEmail = await UserModel.findUserByEmail(email);

    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Menentukan nilai avatar
    const avatar =
      "https://images.tokopedia.net/img/cache/300/default_v3-usrnophoto0.png";

    // Buat pengguna baru
    const newUser = await UserModel.createUser({
      username,
      email,
      password,
      avatar, // Menggunakan nilai default avatar
    });

    // Menghasilkan token JWT setelah pengguna berhasil mendaftar
    const token = generateToken({
      id: newUser.user_id, // Mengambil ID dari pengguna yang baru dibuat
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
    });

    res.json({ user: newUser, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register/phone", async (req, res) => {
  const { username, numberPhone, password } = req.body;

  // Validasi bidang yang diperlukan
  if (!username || !numberPhone || !password) {
    return res.status(400).json({
      error: "Username, number phone, and password are required",
    });
  }

  try {
    // Cek apakah nomor telepon sudah digunakan
    const existingUserByNumberPhone = await UserModel.findUserByNumberPhone(
      numberPhone
    );

    if (existingUserByNumberPhone) {
      return res.status(400).json({ error: "Number phone is already in use" });
    }

    // Menentukan nilai avatar
    const avatar =
      "https://images.tokopedia.net/img/cache/300/default_v3-usrnophoto0.png";

    // Buat pengguna baru
    const newUser = await UserModel.createUser({
      username,
      numberPhone,
      password,
      avatar, // Menggunakan nilai default avatar
    });

    // Menghasilkan token JWT setelah pengguna berhasil mendaftar
    const token = generateToken({
      id: newUser.user_id, // Mengambil ID dari pengguna yang baru dibuat
      username: newUser.username,
      numberPhone: newUser.numberPhone,
      avatar: newUser.avatar,
    });

    res.json({ user: newUser, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { emailOrNumberPhone, password } = req.body;

  // Validasi bidang yang diperlukan
  if (!emailOrNumberPhone || !password) {
    return res
      .status(400)
      .json({ error: "Email/Number phone and password are required" });
  }

  try {
    // Cari pengguna berdasarkan email atau number phone
    const user = await UserModel.findUserByEmailOrNumberPhone(
      emailOrNumberPhone
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verifikasi password
    // (Perhatikan bahwa cara ini tidak aman dan Anda sebaiknya menggunakan hashing password)
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Jika password valid, buat token JWT
    const tokenPayload = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      numberPhone: user.numberPhone,
      avatar: user.avatar, // Menggunakan avatar pengguna
    };

    const token = generateToken(tokenPayload);

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/users/scret", async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
