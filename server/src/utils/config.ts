import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGO_URI);
export const config = {
    mongoUri: process.env.MONGO_URI,
    port: Number(process.env.PORT),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL,
    cookieName: process.env.REFRESH_COOKIE_NAME,
    cookieDomain: process.env.COOKIE_DOMAIN,
    cookieSecure: (process.env.COOKIE_SECURE || "false").toLowerCase() === "true",
    cookieSameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};


