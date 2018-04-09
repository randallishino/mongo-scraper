//scraping tools
var request = require("request");
var cheerio = require("cheerio");
var methodOverride = require("method-override");
var Article = require('../models/article.js');
var Note = require('../models/note.js');

module.exports = function(router) {

    // find all unsaved articles
	router.get("/", function(req, res){
		Article.find({
			saved: false
		}, function(err, dbArticle) {
		if (err) {
			res.send(err);
        }
        // save data into an object and render into handlebars
		else{
			res.render("index", {article: dbArticle} );
		}
		});
	});

    router.get("/scrape", function(req, res) {
        // making http request to grab html
        request("https://www.nytimes.com/", function(error, response, html) {
          // saving info into cheerio
        var $ = cheerio.load(html);
          // looping over each article tag
          $("article").each(function(i, element) {
      
            // Save an empty result object
            var result = {};
      
            // saving all text into result object
            result.title = $(this).children("h2").text();
            result.summary = $(this).children(".summary").text();
            result.link = $(this).children("h2").children("a").attr("href");
      
            // Using our Article model, create a new instance
            var new_Article = new Article(result);
      
            // saving data into db using new instance
            new_Article.save(function(err, res) {
              // Log any errors
              if (err) {
                console.log(err);
              }
              else {
                console.log(res);
              }
            });
          })
        });
    });




	// This route renders the saved handledbars page
  router.get("/saved", function(req, res) {
       Article.find({saved: true})
       .populate("notes", 'body')
       .exec(function(err, dbArticle) {
    if (err) {
      res.send(err);
    }
    else {
      res.render("articles", {saved: dbArticle});
    }
  	});
  });

  
  // put route to updated the article to be saved:true
  router.post("/saved/:id", function(req, res) {
	  Article.update({_id: req.params.id}, {$set: {saved: true}}, function(err, dbArticle) {
	    if (err) {
	      res.send(err);
	    }
	    else {
	      res.redirect("/");
	    }
	  });
	});

	//delete route for articles on the saved page
	router.post("/delete/:id", function(req, res){
		 Article.update({_id: req.params.id}, {$set: {saved: false}}, function(err, dbArticle) {
	    if (err) {
	      res.send(err);
	    }
	    else {
	      res.redirect("/saved");
	    }
	  });
	})

	//post route for saving a note to an article
	router.post("/saved/notes/:id", function(req, res) {
	  var newNote = new Note(req.body);
	  console.log("new note" + newNote);
	  newNote.save(function(error, dbNote) {
	    if (error) {
	      res.send(error);
	    }
	    else {
	      Article.findOneAndUpdate({_id: req.params.id}, { $push: { "notes": dbNote._id } }, { new: true }).exec(function(err, newdoc) {
	        if (err) {
	          res.send(err);
	        }
	        else {
	          res.redirect("/saved");
	        }
	      });
	    }
	  });
	});

	// delete route to delete a note
	router.post("/saved/delete/:id", function(req, res) {
	  Note.remove({_id: req.params.id}, function(err, dbNote){
	    if (err) {
	      res.send(err);
	    }
	    else {
	      res.redirect("/saved");
	    }
	  });
	});
}