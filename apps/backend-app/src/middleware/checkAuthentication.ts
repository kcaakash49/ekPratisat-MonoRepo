import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt.js";

export const checkAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // 1️⃣ Try Authorization header (mobile)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Try cookies (web)
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({
      error: "Not Authorized, Missing Token",
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    return res.status(403).json({
      error: "Invalid or Expired token",
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
};

export const requireAdminOrStaff = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!["admin", "staff"].includes(req.user?.role)) {
    return res.status(403).json({ error: "Admin or Staff only" });
  }
  next();
};