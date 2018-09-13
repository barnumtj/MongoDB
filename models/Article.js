
// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var articleSchema = new Schema({
  // title is a required string
  title: {
    type: String
    // required: true
  },

  summary: {
      type: String
  },
  // link is a required string
  link: {
    type: String
    // required: true
  },
  comment: {
    type: String,
    ref: 'Comment'
  }
 
});

// Create the Article model with the ArticleSchema
var article = mongoose.model("article", articleSchema);

// Export the model
module.exports = article;