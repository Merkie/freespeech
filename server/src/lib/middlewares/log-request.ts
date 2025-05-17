import { Request, Response, NextFunction } from 'express';

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    `[${new Date(Date.now()).toUTCString()}] ${req.method} ${req.path}`
  );
  next();
}
