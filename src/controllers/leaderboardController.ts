import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLeaderboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topOptions = await prisma.option.findMany({
      orderBy: { voteCount: "desc" },
      take: 10,
    });

    res.json(topOptions);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
