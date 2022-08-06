import express, { Router } from "express";
import UsersController from "../controllers/users";
import auth from "../middleware/auth";

const router = Router();
const UserController = new UsersController();

router.put("/register", UserController.register);
router.post("/getUsers", auth, UserController.getUsers);

export default router;
