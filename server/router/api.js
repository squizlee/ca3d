const apiRouter = require("express").Router();
const multer = require("multer")
const path = require("path");
const upload = multer({dest: path.resolve(__dirname, "../../tmp")});
const fs = require("fs");

apiRouter.get("/", (req, res) => {
	res.send("Hello from the API");
});

apiRouter.post("/image", upload.single("image"), (req, res) => {
	let file = req.file;
	let fileType = /image\/(png|jpeg|jpg)$/.exec(file.mimetype);
	if(fileType === null){
		console.error("Error, file is not a jpeg or a png");
		res.status(400).redirect("/");
	}

	// rename file with filetype extension
	// fileType[1] holds the file type extension
	fs.rename(file.path, `${file.path}.${fileType[1]}`, (err) => {
		if (err) {
			console.error(err);
			res.status(500).redirect("/");
		}
	});

	// do puppeteer stuff

	res.status(200).redirect("/");
});

module.exports = apiRouter;