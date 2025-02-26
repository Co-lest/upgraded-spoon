import fs from "fs/promises";
import path from "path";

export async function loadFile(res, filePath) { // filepath  should be the full path like literally the one combined
    const fullPath = path.join(__dirname, "src", filePath);

    const filedata = await fs.readFile(filePath);
    const extname = path.extname(filePath);
    const contentType =
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
    }[ext] || "text/plain";

    res.writeHead({"Content-Type": contentType});
    res.end(filedata);
}

export async function loadFileHome(res, filePath) {
    try {
        const fullPath = path.join(__dirname, "src", filePath);

        const filedata = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "text/javascript",
        }[ext] || "text/plain";
    
        res.writeHead(200, {"Content-Type": contentType});
        res.end(filedata);
    } catch (err) {
        console.error(`File not found!`);

        res.writeHead(404, {"Content-Type": contentType});
        res.end(filedata);
        return;
    }
}