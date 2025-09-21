import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", AuthController.signup);
router.post("/auth/login", AuthController.login);
router.get("/me", AuthController.me);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/refresh", AuthController.refresh);
router.get("/auth/google", AuthController.googleAuth);
router.get("/auth/google/callback", AuthController.googleCallback);

export default router;
