const User = require('../models/User');
const Technician = require("../models/Technician")

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      serviceId,
      degree,
      experience,
      about,
      availability,
      address
    } = req.body;

    const image = req.file ? req.file.path : "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let user;

    // 🔒 Technician registration
    if (role === "technician") {

      if (!serviceId || !about) {
        return res.status(400).json({
          message: "serviceId and about are required for technicians"
        });
      }

      user = await Technician.create({
        name,
        email,
        password,
        image,
        phone,
        role: "technician",
        serviceId,
        degree,
        experience,
        about,
        availability,
        address,
        isApproved: false // 🔐 forced
      });

    } else {
      // 🔒 Customer only
      user = await User.create({
        name,
        email,
        password,
        image,
        phone,
        address,
        role: "customer"
      });
    }

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isApproved: user.isApproved,
        address: user.address
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email, password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = user.generateToken();
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image, isApproved: user.isApproved, address: user.address }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login };
