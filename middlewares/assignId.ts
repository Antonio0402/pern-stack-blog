import { NextFunction, Request, Response } from "express";
import * as uuid from "uuid";

const assignId = (req: Request, _res: Response, next: NextFunction) => {
  req.id = uuid.v4();
  next();
}

export default assignId;