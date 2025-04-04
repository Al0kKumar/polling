import { PrismaClient } from "@prisma/client";
import { producer } from "../config/kafka.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const voteOnPoll = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { id } = req.params;
    const { optionId } = req.body; // Keep as string

    if (!optionId || typeof optionId !== "string") {
      res.status(400).json({ error: "Invalid option ID" });
      return;
    }

    // Validate poll and option
    const pollOption = await prisma.option.findUnique({ where: { id: optionId } });
    if (!pollOption) {
      res.status(404).json({ error: "Option not found" });
      return;
    }

    // Send vote to Kafka
    await producer.send({
      topic: "votes",
      messages: [{ value: JSON.stringify({ optionId }) }],
    });

    res.status(200).json({ message: "Vote received and sent to Kafka" });
  } catch (error) {
    console.error("Error in voteOnPoll:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
