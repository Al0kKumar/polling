import express from "express";
import { voteOnPoll } from "../controllers/voteController.js";

const router = express.Router();

router.post("/:id/vote", voteOnPoll);

export default router;
