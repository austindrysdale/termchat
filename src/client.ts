import { TextLineStream } from "@std/streams";

const endpoint = "ws://localhost:8000";
const ws = new WebSocket(endpoint);

let username: string | null = null;

// Handle connection opening
ws.onopen = async () => {
  console.clear();
  console.log("Connected to chat server!");

  // Get username using prompt
  username = prompt("Please enter your username:");
  if (!username) {
    console.log("Username is required!");
    ws.close();
    Deno.exit(1); // Quit program if no username
  }

  ws.send(username); // Send username to server

  console.log("You're now connected to the chat!");
  console.log("Start typing messages...");

  // Start reading chat messages after username is set
  const lines = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  try {
    for await (const line of lines) {
      if (line.toLowerCase() === "/quit") {
        ws.close();
        Deno.exit(0);
      }
      ws.send(line);
    }
  } catch (error: unknown) {
    console.error("Error reading input:", error);
    ws.close();
    Deno.exit(1);
  }
};

ws.onmessage = (message) => {
  // Try to parse JSON message from chat server
  try {
    const parsedMessage = JSON.parse(message.data);
    console.log(
      `[${parsedMessage.timestamp}] ${parsedMessage.username}: ${parsedMessage.content}`,
    );
  } catch {
    // If not JSON, just print the raw message
    console.log(message.data);
  }
};

// Handle connection closing
ws.onclose = () => {
  console.log("Disconnected from server");
  Deno.exit(0);
};

// Handle connection errors
ws.onerror = (error) => {
  console.error("WebSocket error:", error);
  ws.close();
  Deno.exit(1);
};
