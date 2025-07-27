import express from "express";
import { loginUser, registerUser, getAllUsers, deleteUser} from "../controllers/userController.js";
import { verifyAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/list", verifyAdmin, getAllUsers);
userRouter.post("/delete", verifyAdmin, deleteUser);

export default userRouter;
