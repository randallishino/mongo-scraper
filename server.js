var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path'); 
// scraping packages
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();
var PORT = process.env.PORT || 3000;
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var Article = require("./models/article.js");
var Note = require("./models/note.js");
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("/public"));


// Use promise syntax
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
