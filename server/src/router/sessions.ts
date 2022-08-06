import express, { Router } from "express";
import SessionsController from "../controllers/sessions";
import auth from "../middleware/auth";

const router = Router();
const SessionController = new SessionsController();

router.post("/login", SessionController.login);
router.patch("/logout", auth, SessionController.logout);

export default router;
