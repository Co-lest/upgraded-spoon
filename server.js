import http from "http";
import "dotenv/config";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { insertUser, connectDatabase } from "./database/database.js";

let connectedToDatabase = true;

(async function databaseState() {
  console.log(`Async connect database!`);
  try {
    connectedToDatabase = await connectDatabase();
  } catch(err) {
    connectedToDatabase = false;
    console.error(`Had an error connecting to database from server!`);
  }
})();

const port = process.env.PORT || 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  let filePath;

  if (req.url) {
    console.log(`${req.url}: ${req.method}`);
  }

  if (req.url === "/") {
    filePath = "index.html";

    loadFile(res, filePath);
  } else if (req.url === "/favicon.ico") {

  } else if (req.method === "POST" && req.url === "/api/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      try {
        const receivedData = JSON.parse(body);
        console.log("Received data:", receivedData);

        if (connectedToDatabase) {
          insertUser(receivedData);
        }
        
        // res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify({ message: "Data received" }));
      } catch (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }

      res.write("Hello from server");
      res.end(JSON.stringify({ status: "success", receivedMessage: body }));
    });
  } else if (req.url === "/login.html") {
    filePath = "login.html";

    loadFile(res, filePath);
  } else if (req.url === "/api/log" && req.method === "POST") {
    let body;

    req.on("data", (dataChunk) => {
      body += dataChunk.toString();
    });

    req.on("end", () => {
      console.log(`Received body: ${body}`);

      res.write("Hello from server");
      res.end(JSON.stringify({ status: "success", receivedMessage: body }));
    });
  } else {
    console.log("Serving static file:", req.url); // Log static file requests
    filePath = req.url.slice(1);


    loadFile(res, filePath);
  }
});

async function loadFile(res, filePath) {
  const fullPath = path.join(__dirname, "src", filePath);
  console.log(fullPath);
  try {
    const content = await fs.readFile(fullPath);
    const ext = path.extname(filePath);
    const contentType =
      {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
      }[ext] || "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  } catch (err) {
    res.statusCode = 404;
    res.end("File not found!");
    console.error(`Error getting the html file`, err);
  }
}

server.listen(port, () => {
  console.log(`Port listening on port: ${port}`);
});
