import type { NextFunction, Request, Response } from "express";

export const errorCatch = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err) => next(err));
  };
};
