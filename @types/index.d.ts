import * as express from "express";
import session, { Session } from "express-session";

type User = {
  accessToken: string;
} | null;

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}


declare global {
  namespace Express {
    interface Request {
      id?: string,
      user_id?: string;
    }
  }
}