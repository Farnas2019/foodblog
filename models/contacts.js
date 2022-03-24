const mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    fname:{
        type: String
    },
    lname:{
        type: String
    },
    email:{
        type: String
    },
    message:{
        type: String
    }
});

var Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;