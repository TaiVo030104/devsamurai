import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { config } from "../utils/config";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = signupSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.signup(name, email, password);
      res.cookie(config.cookieName, refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: config.cookieSameSite as any,
        domain: config.cookieDomain,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      });
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ message: "Invalid input", issues: err.issues });
      return res.status(400).json({ message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);
      res.cookie(config.cookieName, refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: config.cookieSameSite as any,
        domain: config.cookieDomain,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      });
    } catch (err: any) {
      if (err?.issues) return res.status(400).json({ message: "Invalid input", issues: err.issues });
      return res.status(400).json({ message: err.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const auth = req.headers.authorization;
      if (!auth?.startsWith("Bearer ")) throw new Error("Missing token");
      const token = auth.slice(7);
      const user = await AuthService.me(token);
      return res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  },

  logout(req: Request, res: Response) {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite as any,
      domain: config.cookieDomain,
    });
    return res.status(204).send();
  },

  async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies?.[config.cookieName];
      if (!token) return res.status(401).json({ message: "Missing refresh token" });
      const { accessToken } = await AuthService.refresh(token);
      return res.json({ accessToken });
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  },

  async googleAuth(req: Request, res: Response) {
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/google/callback')}&response_type=code&scope=email profile`;

      return res.json({ url: googleAuthUrl });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },

  async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code) return res.status(400).json({ message: "Missing authorization code" });
      
      const { user, accessToken, refreshToken } = await AuthService.googleAuth(code as string);
      
      res.cookie(config.cookieName, refreshToken, {
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: config.cookieSameSite as any,
        domain: config.cookieDomain,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
      
      const frontendUrl = `http://localhost:5173/dashboard?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userInfo))}`;
      return res.redirect(frontendUrl);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
};
