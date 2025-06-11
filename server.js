const express = require("express");
const app = express();
const http = require("http").createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server: http });

let clients = [];

wss.on("connection", (ws) => {
     ws._socket.setNoDelay(true);
  console.log("👋 Client connected");
  clients.push(ws);

  ws.on("message", (msg) => {
    console.log("📦 Message:", msg);
    clients.forEach(c => {
      if (c !== ws && c.readyState === WebSocket.OPEN) {
        c.send(msg);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
    clients = clients.filter(c => c !== ws);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`✅ WebSocket running at wss://${process.env.RENDER_EXTERNAL_HOSTNAME || "localhost:" + PORT}`);
});
