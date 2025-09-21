import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "./config";
import { UserDocument } from "../models/user.model";

export type JwtPayload = { sub: string; email: string };

export function signAccessToken(user: UserDocument) {
  const payload: JwtPayload = { sub: user.id, email: user.email };
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: config.accessTokenTtl });
}

export function signRefreshToken(user: UserDocument) {
  const payload: JwtPayload = { sub: user.id, email: user.email };
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.refreshTokenTtl });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
