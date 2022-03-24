const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name:{
        type: String,
    }, image:{
        type: String,
    }, ingredients:{
        type: String,

    }, procedures:{
        type: String,
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;