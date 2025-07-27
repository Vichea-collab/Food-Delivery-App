import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const role = user.role;
    const token = createToken(user._id);

    // ✅ Return userId explicitly
    res.json({ success: true, token, role, userId: user._id });
  } catch (error) {
    console.log("Login Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get all users (for admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password"); // exclude passwords
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.json({ success: false, message: "Failed to fetch users" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id, userId } = req.body;
    if (!userId || !id) {
      return res.json({ success: false, message: "Missing userId or id" });
    }

    const adminUser = await userModel.findById(userId);
    if (!adminUser) {
      console.log("❌ Admin user not found");
      return res.json({ success: false, message: "Admin not found" });
    }

    if (adminUser.role !== "admin") {
      console.log("❌ User is not an admin");
      return res.json({ success: false, message: "You are not admin" });
    }

    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) {
      console.log("❌ Target user not found");
      return res.json({ success: false, message: "User not found" });
    }

    console.log("✅ User deleted:", deleted._id);
    return res.json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    console.error("🔥 Error in deleteUser:", error);
    return res.json({ success: false, message: "Error deleting user" });
  }
};



export { loginUser, registerUser, getAllUsers, deleteUser };

