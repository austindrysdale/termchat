
# TermChat

A simple terminal-based chat application built with Deno and WebSockets.

This project was created as a learning exercise for my friend to explore:
- Deno runtime and it's ecosystem
- WebSocket communication
- Terminal-based applications
- Real-time chat systems

## Installation

Install the client
```bash
deno install --allow-net -n termchat jsr:@yourusername/termchat/src/termchat-client
```

Install the server:
```bash
deno install -A -n termchat-server jsr:@yourusername/termchat/src/termchat-server
```

## Usage

1. Start the client
```bash
termchat
```
2. Start the server
```bash
termchat-server
```
3. When prompted, enter your desired username.
4. Start chatting!
5. Type '/quit' to exit.

## Features

- Real-time messaging using WebSockets
- Simple username-based identification
- Message history stored in SQLite database
- Clean terminal interface

## Project Structure

```bash
termchat/
├── src/
│  ├── client.ts  # Core client logic
│  └── server.ts  # Core server logic
└── cli/
├── termchat-client.ts  # Client entry point
└── termchat-server.ts  # Server entry point
```

## Learning Resources

If you're interested in learning more about the technologies used in this project:
- Deno Documentation
- WebSocket API
- SQLite with Deno

## Contributing
This is a learning project, but suggestions and improvements are welcome!

## License
MIT License
Copyright (c) 2025 A. K. Drysdale