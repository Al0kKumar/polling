import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();


const kafkaBroker = process.env.KAFKA_BROKER;
if (!kafkaBroker) {
  throw new Error("❌ KAFKA_BROKER is not set in the environment variables.");
}

const kafka = new Kafka({
  clientId: "polling-app",
  brokers: [kafkaBroker],
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (error) {
    console.error("Failed to connect Kafka Producer:", error);
  }
};

connectProducer();

export { producer };
