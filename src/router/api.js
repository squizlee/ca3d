const apiRouter = require("express").Router();
const multer = require("multer")
const path = require("path");
const upload = multer({dest: path.resolve(__dirname, "../../tmp")});

apiRouter.get("/", (req, res) => {
	res.send("Hello from the API");
});

apiRouter.post("/image", upload.single("image"), (req, res) => {
	console.log("API Image route posted");
	console.log(req.file);
	// TODO: Return back to index with status
});

module.exports = apiRouter;