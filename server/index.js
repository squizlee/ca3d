// MAIN INIT FILE

// IMPORTS
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// VARS
const server = express();
const PORT = 8888;
const publicDir = path.resolve(__dirname, "../public");

server.use(express.static(publicDir));
server.use('../lib/dat.gui.module.js', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/libs/dat.gui.module.js')));

server.listen(PORT, () => {
	console.log(`Automata at localhost:${PORT}`);
});