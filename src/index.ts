import express, { Application } from "express";
import { createServer, Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import "./consumer/voteConsumer.js"

dotenv.config();

const app: Application = express();
const server: Server = createServer(app);
const wss: WebSocketServer = new WebSocketServer({ server });

app.use(express.json());

app.use("/polls", pollRoutes);
app.use("/votes", voteRoutes);
app.use("/leaderboard", leaderboardRoutes);

// WebSocket Setup
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  ws.send(JSON.stringify({ message: "Connected to WebSocket Server" }));

  ws.on("close", () => console.log("Client disconnected"));
});

const PORT: number = Number(process.env.PORT) || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, wss };
