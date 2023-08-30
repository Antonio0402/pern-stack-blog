import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404);
  const error = `🔍 - Not Found - ${req.originalUrl}`;
  if (req.accepts("json")) {
    res.json({ "Error": error })
  } else {
    res.type("txt").send(error);
  }
}

export default notFound;