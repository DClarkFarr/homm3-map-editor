require("dotenv").config();

var express = require("express");
var cors = require("cors");
var path = require("path");
var fileService = require("./services/FileService");

var app = express();

app.use(cors());

app.get("/template", async (req, res) => {
  const templates = await fileService.getTemplates();

  res.json(templates);
});

app.get("/test", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.use(express.static(path.join(__dirname, "..", "web", "dist")));

app.listen(process.env.PORT, function () {
  console.log("CORS-enabled web server listening on port " + process.env.PORT);
});
