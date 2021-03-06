// setup required packages for use
var exphbs = require("express-handlebars");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require('request');
var methodOverride = require("method-override");

// scraping packages
var cheerio = require("cheerio");

var app = express();
var PORT = process.env.PORT || 3000;
// If deployed, use the deployed database. Otherwise use the local mongoScraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

// require models 
var Note = require("./models/note.js");
var Article = require("./models/article.js");


// Set up an Express Router
var router = express.Router();

// Require our routes file pass our router object
require("./routes/routes.js")(router);

// Have every request go through our router middleware
app.use(router);

// establish mongoose connection
var db = mongoose.connection;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(express.static("views"));
app.use(methodOverride("_method"));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use promise syntax
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

db.once("open", function() {
    console.log("Mongoose connection successful.");
  });
  

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

