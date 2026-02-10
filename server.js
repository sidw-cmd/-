const http = require("http");
const path = require("path");
const fs = require("fs");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  let file = req.url === "/" ? "index.html" : req.url.slice(1);
  const filePath = path.join(PUBLIC_DIR, file);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  ws.on("message", msg => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    }
  });
});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
