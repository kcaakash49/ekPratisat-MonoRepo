import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt.js";

export const checkAuthentication = async(req: Request, res:Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            error: "Not Authorized, Missing Token"
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token!)
        req.user = {id: payload.userId, role: payload.role};
        next();
    }catch(err){
        return res.status(403).json({
            error: "Invalid or Expired token"
        })
    }
}