var express = require("express");
var mongoose = require("mongoose")
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var db1 = require("./models")
var PORT = 4200;

// Initialize Express
var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)







// db.on("error", function (error) {
//     console.log("Mongoose Error: ", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function () {
//     console.log("Mongoose connection successful.");
// });




app.get("/scrape", function (req, res) {

    request("https://www.kansascity.com/sports/", function (error, response, html) {


        var $ = cheerio.load(html);
        var results = {};

        $("article.media").each(function (i, element) {

            // Save the text of the element in a "title" variable
            results.title = $(element).find('h4.title').text();
            results.summary = $(element).find('p.summary').text();
            results.link = $(element).find('a').attr('href').split(",")[0].split(" ")[0];

            if (results.summary !== '') {
                db1.Article.remove({}, function(err) { 
                    console.log('collection removed') 
                 });
                db1.Article.create(results)
                .then(function(data) {
                  // View the added result in the console
                  console.log(data);
                })
                .catch(function(err) {
                  // If an error occurred, send it to the client
                  return res.json(err);
                });

            };
        });
        res.send('scrape complete')
    });
});

app.get("/", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db1.Article.find({})
      .then(function(data){
        var hbsObject = {
            articles: data
        }
        res.render('index', hbsObject)
        console.log(hbsObject)
    })
    
});

app.get("/articles/:id", function(req, res){
    db1.Article.find({})
    .populate("comment")
    .then(function(data){
        res.json(data)
        console.log(data)
    })
})

app.get("/saved", function(req, res){
    res.render('saved')
})





app.listen(PORT, function () {
    console.log("app is listening on " + PORT)

})