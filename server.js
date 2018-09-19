var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var db1 = require("./models");
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser')
var PORT = 4200;

// Initialize Express
var app = express();
app.use(morgan("dev"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/public", express.static(path.join(__dirname, 'public')));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);







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
                // db1.Article.remove({}, function(err) { 
                //     console.log('collection removed') 
                //  });
                db1.Article.create(results)
                .then(function(data) {
                })
                .catch(function(err) {
                  return res.json(err);
                });

            };
        });
        res.send('scrape complete')
    });
});

app.get("/", function(req, res) {
    // grab all the articles to display
    db1.Article.find({})
      .then(function(data){
        var hbsObject = {
            articles: data
        }
        res.render('index', hbsObject)
        console.log(hbsObject)
    })
    
});

app.get('/article/:id', function(req, res){
    db1.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then(function(article){
        res.render('comment', {article})
        console.log(article)
    });
    
});

app.get('/save/:id', (req,res) => {
    // update article to saved when save is clicked changing saved to 'true'
    db1.Article
      .update({_id: req.params.id},{saved: true})
      .then(function(){ res.redirect('/')})
      .catch(err => res.json(err));
});

app.get('/saved', function(req, res){
    db1.Article.find({"saved": true})
    .then(function(data){
        var hbsObject = {
            articles: data
        }
        res.render('saved', hbsObject)
    })
})

app.put('/delete/:id', function(req, res){
    db1.Article
    .update({_id: req.params.id},{$set: {saved: false}})
    .then(function(){res.redirect('saved')})
    .catch(function(err){
        res.json(err);
    })
})

app.post('/comment/:id', function(req, res){
    db1.Comment.create({comment: req.body.comment})
    .then(function(comment){

    return db1.Article.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {comment: comment._id}},
            {new: true}
        )
        .then(function(){
        res.json(comment)
    })   
})
    // .then(function(){res.redirect('saved')})
    .catch(function(err){
        res.json(err)
    })
})

app.put('/comment/:id', function(req, res){
    db1.Comment
    .update({_id: req.params.id},{$set: {deleted: true}})
    .then(function(){res.redirect('saved')})
    .catch(function(err){
        res.json(err);
    })
})



app.listen(PORT, function () {
    console.log("app is listening on " + PORT)

})