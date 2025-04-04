import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface PollOption {
  text: string;
}

interface CreatePollRequest extends Request {
  body: {
    question: string;
    options: string[];
  };
}

// Create a new poll
export const createPoll = async (req: CreatePollRequest, res: Response): Promise<void> => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      res.status(400).json({ error: "Poll must have a question and at least two options." });
      return;
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });

    res.status(201).json(poll);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

// Get all polls
export const getPolls = async (_req: Request, res: Response): Promise<void> => {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: true },
    });
    res.json(polls);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

// Get a single poll by ID
export const getPollById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!poll) {
      res.status(404).json({ error: "Poll not found" });
      return;
    }

    res.json(poll);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
