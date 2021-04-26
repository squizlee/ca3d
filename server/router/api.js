const apiRouter = require("express").Router();
const multer = require("multer")
const path = require("path");
const upload = multer({dest: path.resolve(__dirname, "../../tmp")});
const fs = require("fs");
const puppet = require("puppeteer");

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
	let fileName = `${file.path}.${fileType[1]}`;
	fs.rename(file.path, fileName, (err) => {
		if (err) {
			console.error(err);
			res.status(500).redirect("/");
		}
	});

	// do puppeteer stuff
	imageProcessing(fileName);

	res.status(200).redirect("/");
});

async function imageProcessing(file){
	const browser = await puppet.launch();
	const page = await browser.newPage();
	await page.goto("https://pinetools.com/image-edge-detection");
	// select edge detection options
	// i don't think this selects the right method but oh well
	await page.click("label>span");
	// file upload
	const fileUpload = await page.$("input[type=file]");
	await fileUpload.uploadFile(file);
	// submit
	await page.click("span.boton");
	for(let i = 0; i < 1000; ++i){
		// nothing
	}
	// output handling
	const image = await page.$("img.jqimg");
	let destination = path.resolve(`${__dirname}/tmp`);
	console.log("destination path", destination);
	await image.screenshot({
		path: destination,
		type:  'png',
	});

	await browser.close();

	return destination;
}

module.exports = apiRouter;