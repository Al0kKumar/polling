import { wss } from "../index.js";


export const broadcastPollUpdate = (pollId : string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: "POLL_UPDATED", pollId }));
    }
  });
};
