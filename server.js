import http from "http";
import "dotenv/config";
import fs from 'fs/promises';
import { fileURLToPath } from "url";
import path from "path";

const port = process.env.PORT || 5500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath;


    if (req.url === "/") {
        filePath = "index.html";
    } else if (req.url === "favicon.ico") {

    } else if (req.url === "" && req.method === "POST") {
        res.on("message", () => {
            
        });
    } else {
        filePath = req.url;
    }

    const fullPath = path.join(__dirname, 'src', filePath);
    console.log(fullPath);
    try {
        const content = await fs.readFile(fullPath);
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript' 
        }[ext] || 'text/plain';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    }catch (err) {
        res.statusCode = 404;
        res.end("File not found!");
        console.error(`Error getting the html file`, err)
    }
});

server.listen(port, () => {
    console.log(`Port listening on port: ${port}`);
});