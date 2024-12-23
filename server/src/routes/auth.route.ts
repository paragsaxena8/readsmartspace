import { Router } from "express";
import {
  activateAccount,
  login,
  logout,
  register,
} from "@controllers/auth/auth.controller";

export const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.get("/logout", logout);
authRoutes.get("/activate", activateAccount);
authRoutes.get("/forgot-password", activateAccount);
