
import { AppError, createLead } from "@repo/functions";
import { Request, Response } from "express";

export const addLead = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user?.role !== "admin" && user?.role !== "staff") {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    req.body.managedById = user.id;

    const adaptedFile = req.file
      ? {
          fieldname: req.file.fieldname,
          buffer: req.file.buffer,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size
        }
      : null;

      console.log("Received lead creation request with body:", req.body);
      console.log("Received file:", adaptedFile);

      const result = await createLead({
        body: req.body,
        file: adaptedFile
      })

      return res.status(200).json({ message: "Lead created successfully", ok:true });

  } catch (error) {
       if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message, ok:false});
       }

       return res.status(500).json({ message: "Internal Server Error", ok:false });

  }
}