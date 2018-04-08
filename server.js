var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path'); 
var request = require('request');
// scraping packages
var cheerio = require("cheerio");

var app = express();
var PORT = process.env.PORT || 3000;
// If deployed, use the deployed database. Otherwise use the local mongoScraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
var Note = require("./models/note.js");
var Article = require("./models/article.js");
var db = mongoose.connection;
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(express.static("views"));



// Use promise syntax
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

// app.get("/", function(req,res) {
//     res.sendFile('index.html');
// });


app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.nytimes.com/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article").each(function(i, element) {
  
        // Save an empty result object
        var result = {};
  
        // Add the title and summary of every link, and save them as properties of the result object
        result.title = $(this).children("h2").text();
        result.summary = $(this).children(".summary").text();
        result.link = $(this).children("h2").children("a").attr("href");
  
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var new_Article = new Article(result);
  
        // Now, save that entry to the db
        new_Article.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
      })
    });
});