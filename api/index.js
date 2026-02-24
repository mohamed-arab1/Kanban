const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();

// Vercel serverless functions are read-only except for the /tmp directory.
// We need to copy the db.json file to /tmp before using it.
const dbPath = path.join(process.cwd(), "db.json");
const tmpDbPath = path.join("/tmp", "db.json");

if (!fs.existsSync(tmpDbPath)) {
    fs.copyFileSync(dbPath, tmpDbPath);
}

const router = jsonServer.router(tmpDbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
