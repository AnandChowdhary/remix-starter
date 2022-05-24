import { createCookie } from "remix";

export const localeCookie = createCookie("pabio_v20220524_locale", {
  path: "/",
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  // Expire in 1 year from now
  expires: new Date(Date.now() + 31_536_000_000),
  maxAge: 31_536_000,
});
