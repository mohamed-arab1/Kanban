const jsonServer = require("json-server");
const db = require("../db.json");

const server = jsonServer.create();

// Pass the JS object directly instead of a file path.
// This forces json-server to run in memory, eliminating ALL Vercel 
// read-only file system (EROFS) and writing errors.
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
