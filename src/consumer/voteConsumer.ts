import { Kafka, EachMessagePayload } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { broadcastPollUpdate } from "../config/websocket.js";

dotenv.config();

const prisma = new PrismaClient();

if (!process.env.KAFKA_BROKER) {
  throw new Error("❌ KAFKA_BROKER is not set in the environment variables.");
}

const kafka = new Kafka({
  clientId: "polling-app",
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "vote-group-new" });

const runConsumer = async () => {
  console.log("🟢 Kafka Consumer is starting...");
  await consumer.connect();
  console.log("✅ Kafka Consumer connected.");
  await consumer.subscribe({ topic: "votes", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      console.log("📥 Received raw Kafka message:", message);

      if (!message.value) {
        console.error("❌ Received message with no value");
        return;
      }

      try {
        const { optionId } = JSON.parse(message.value.toString());
        console.log(`🛠 Processing vote for option ID: ${optionId}`);

        
        const pollOption = await prisma.option.findUnique({
          where: { id: optionId },
          select: { pollId: true },
        });

        console.log(`🔍 Looking for option ID: ${optionId} - Found:`, pollOption);

        if (!pollOption) {
          console.error(`❌ No option found with ID: ${optionId}`);
          return;
        }

        // Update vote count in db
        console.log(`🔄 Updating vote count for option ID: ${optionId}`);
        await prisma.option.update({
          where: { id: optionId },
          data: { voteCount: { increment: 1 } },
        });
        console.log(`✅ Successfully incremented vote for ${optionId}`);

        // Broadcast updated poll data (web sockets in use)
        broadcastPollUpdate(pollOption.pollId);
      } catch (error) {
        console.error("❌ Error processing Kafka message:", error);
      }
    },
  });
};

runConsumer().catch((error) => {
  console.error("❌ Kafka consumer error:", error);
});
