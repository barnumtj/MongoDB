
// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create comment schema
var CommentSchema = new Schema({
  // title is a required string
  comment: {
    type: String
    // required: true
  },


});

// Create the comment model with the CommentSchema
var comment = mongoose.model("Comment", CommentSchema);

// Export the model
module.exports = comment;