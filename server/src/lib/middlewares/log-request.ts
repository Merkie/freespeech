import { Request, Response, NextFunction } from "express";

export function logRequest(req: Request, res: Response, next: NextFunction) {
  console.log(
    `[${new Date(Date.now()).toUTCString()}] ${req.method} ${req.path}`
  );
  next();
}
