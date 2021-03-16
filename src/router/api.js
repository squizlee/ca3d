const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
	res.send("Hello from the API");
});

module.exports = apiRouter;