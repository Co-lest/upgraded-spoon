import http from "http";
import "dotenv/config";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { insertUser, connectDatabase, loginUser , fetchHomepage } from "./database/database.js";
import { WebSocketServer } from "ws";

let connectedToDatabase = false;

(async function databaseState() {
  try {
    connectedToDatabase = await connectDatabase();
  } catch(err) {
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
  } else if (req.url === "/login.html") {
    filePath = "login.html";

    loadFile(res, filePath);
  } else if (req.url == "/home.html") {
    filePath = "home.html";

    loadFile(res, filePath);
  } else if (req.url === "/favicon.ico") {

  } else if (req.method === "POST" && req.url === "/api/users") {
    let body = "";
    filePath = "home.html";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const receivedData = JSON.parse(body);
        console.log("Received data:", receivedData);

        if (connectedToDatabase) {
          let doesUserExist;
          (async () => {
            doesUserExist = await insertUser(receivedData);
          })();

          if (doesUserExist) {
            console.log(`Username already taken!`);
            // res.writeHead(200, { "Content-Type": "application/json" });
            // res.end(JSON.stringify({ message: "Username already used!" }));
          } else {
            (async() => {
              await loadFile(res, filePath);
            })();
          }
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
  } else {
    console.log("Serving static file:", req.url); // Log static file requests
    filePath = req.url.slice(1);

    await loadFile(res, filePath);
  }
});

const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  console.log(`A new user connected!`);

  ws.on("message", (data) => {
    let receivedData = JSON.parse(data);
    console.log(receivedData);
    if (connectedToDatabase && receivedData.type === "homepage") {
      fetchHomepage(receivedData)
      .then((userData) => {
        // console.log(userData[0].name);
        let profileObj = {};

        profileObj.name = userData[0].name;
        profileObj.interests = userData[0].interests;
        profileObj.age = userData[0].age;
        profileObj.school = userData[0].school;
        profileObj.type = "homeUserData";

        ws.send(JSON.stringify(profileObj));
      });
    } else if (connectedToDatabase) {
      loginUser(receivedData)
      .then((logboool) => {
        if (logboool) {
          console.log(`Logbool: ${logboool}`);
          ws.send(JSON.stringify({IsloggedIn: logboool}));
        } else {
          console.log(`Username or password does not match: ${logboool}`);
          ws.send(JSON.stringify({IsloggedIn: logboool}));
        }
      });
    }
  });
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
    return;
  } catch (err) {
    res.statusCode = 404;
    res.end("File not found!");
    console.error(`Error getting the html file`, err);
  }
}

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

// async function loadFileHome(res, filePath) {
//   const fullPath = path.join(__dirname, "src", filePath);
//   console.log(fullPath);
//   try {
//     const content = await fs.readFile(fullPath);
//     const ext = path.extname(filePath);
//     const contentType =
//       {
//         ".html": "text/html",
//         ".css": "text/css",
//         ".js": "text/javascript",
//       }[ext] || "text/plain";

//     res.writeHead(200, { "Content-Type": contentType });
//     res.end(content);
//   } catch (err) {
//     // res.statusCode = 404;
//     // res.end("File not found!");
//     // console.error(`Error getting the html file`, err);

//     const content = await fs.readFile(fullPath);
//     const ext = path.extname(filePath);
//     const contentType =
//       {
//         ".html": "text/html",
//         ".css": "text/css",
//         ".js": "text/javascript",
//       }[ext] || "text/plain";

//     res.writeHead(200, { "Content-Type": contentType });
//     res.end(content);
//   }
// }