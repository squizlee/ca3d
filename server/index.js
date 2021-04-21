// MAIN INIT FILE

// IMPORTS
const express = require("express");
const path = require("path");
const apiRouter = require("./router/api");
const bodyParser = require("body-parser");

// VARS
const server = express();
const PORT = 8888;
const publicDir = path.resolve(__dirname, "../public");

server.use(express.static(publicDir));
server.use("/api", apiRouter);

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});