const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    name:{
        type: String
    },
    message:{
        type: String
    }
})

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;