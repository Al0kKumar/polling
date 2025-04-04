import express from "express";
import { createPoll, getPolls, getPollById } from "../controllers/pollController.js";

const router = express.Router();

router.post("/", createPoll);  // Create a new poll
router.get("/", getPolls);  // Get all polls
router.get("/:id", getPollById);  // Get a poll by ID

export default router;
