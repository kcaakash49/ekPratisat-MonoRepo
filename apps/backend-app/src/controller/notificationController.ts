import { prisma } from "@repo/database";
import { AppError } from "@repo/functions";
import { Request, Response } from "express";

export async function getNotification(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Please log in to view notification",
      });
    }

    const result = await prisma.notificationRecipient.findMany({
      where: { recipientId: user.id, isRead: false },
      select: {
        id: true,
        isRead: true,
        readAt: true,
        event: {
          select: {
            title: true,
            body: true,
            link: true,
            createdAt: true,
          },
        },
      },
    });

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server couldn't process your request!!!",
    });
  }
}

export async function markAllRead(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }

    const result = await prisma.notificationRecipient.updateMany({
      where: { recipientId: user.id },
      data: {
        isRead: true,
        isDelivered: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Notification Cleared!!!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server couldn't process your request!!!",
    });
  }
}

export async function markRead(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      throw new AppError(400, "Invalid property id");
    }

    const result = await prisma.notificationRecipient.update({
      where: { id, recipientId: user.id },
      data: {
        isDelivered: true,
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      ok: true,
      message: "Notification Status updated!!!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Server couldn't process your request!!!",
    });
  }
}
