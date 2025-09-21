import { UserRepository } from "../repositories/user.repository";
import { hashPassword, signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/auth.util";
import { google } from "googleapis";
import { config } from "../utils/config";

export const AuthService = {
  async signup(name: string, email: string, password: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const passwordHash = await hashPassword(password);
    const user = await UserRepository.create({ 
      name, 
      email, 
      passwordHash,
      authProvider: 'local'
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || user.authProvider !== 'local' || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    return { user, accessToken, refreshToken };
  },

  async me(accessToken: string) {
    const payload = verifyAccessToken(accessToken);
    const user = await UserRepository.findById(payload.sub);
    if (!user) throw new Error("User not found");
    return user;
  },

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserRepository.findById(payload.sub);
    if (!user) throw new Error("User not found");
    const accessToken = signAccessToken(user);
    return { accessToken };
  },

  async googleAuth(code: string) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        config.googleClientId,
        config.googleClientSecret,
        'http://localhost:3000/api/auth/google/callback'
      );

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.name) {
        throw new Error('Unable to get user information from Google');
      }

      let user = await UserRepository.findByEmail(data.email);
      if (!user) {
        user = await UserRepository.create({
          name: data.name,
          email: data.email,
          authProvider: 'google',
          googleId: data.id
        });
      } else if (user.authProvider === 'local') {
        user.authProvider = 'google';
        user.googleId = data.id;
        await user.save();
      }

      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw new Error('Google authentication failed');
    }
  }
};
