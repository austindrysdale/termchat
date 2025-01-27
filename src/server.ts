import { Database } from "@db/sqlite";

const db = new Database("store.db");

const sqlCreateTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
db.prepare(sqlCreateTable).run();

const storeMessage = (username: string, content: string) => {
  db.exec("INSERT INTO messages (username, content) VALUES (?, ?)", [
    username,
    content,
  ]);
};

// Initialize store for active connections
const activeConnections = new Map();
// Example of how we'll use the Map:
// Key: WebSocket connection
// Value: Username
// activeConnections.set(socket, "user123");

const broadcast = (message: string, sender?: WebSocket) => {
  activeConnections.forEach((_username, socket) => {
    if (socket != sender && socket.readyState === 1) {
      socket.send(message);
    }
  });
};

const isUsernameAvailable = (username: string) => {
  return !activeConnections.has(username);
};

const formatMessage = (username: string, content: string) => {
  const timestamp = new Date().toLocaleTimeString();
  return JSON.stringify({
    type: "message",
    username,
    content,
    timestamp,
  });
};

Deno.serve((req) => {
  // Check that incoming request wants to create websocket (else deny)
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let isRegistered = false;

  socket.addEventListener("message", (event) => {
    try {
      if (!isRegistered) {
        const username = event.data.trim();

        if (isUsernameAvailable(username)) {
          isRegistered = true;
          activeConnections.set(socket, username);
          console.log(`${username} connected.`);
          broadcast(`${username} has joined the chat!`);
          socket.send(
            `Welcome ${username}! There are ${activeConnections.size} users online.`,
          );
        } else {
          socket.send(
            `Username has already been taken. Please chooser another.`,
          );
        }
      } else {
        const username = activeConnections.get(socket);
        const content = event.data;

        const formattedMessage = formatMessage(username, content);

        storeMessage(username, formattedMessage);

        socket.send(formattedMessage);
        broadcast(formattedMessage, socket);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      socket.send("Error processing message");
    }
  });

  socket.addEventListener("close", () => {
    const username = activeConnections.get(socket);
    if (username) {
      activeConnections.delete(socket);
      console.log(`${username} has disconnected.`);
      broadcast(`${username} has left the chat!`);
    }
  });

  return response;
});

console.log("Server (Websocket) is running on http://localhost:8000");
