import { Request, Response } from "express";

interface MessageResponse {
  message: string;
}

interface ErrorResponse extends MessageResponse {
  stack?: string;
}

const errHandler = (err: Error, _req: Request, res: Response<ErrorResponse>) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? '🥞' : err.stack
  })
}

export default errHandler;