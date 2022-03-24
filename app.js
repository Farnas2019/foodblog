const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const formidable = require("formidable");
const methodOverrride= require("method-override");

const path = require("path");

const mongoose = require("mongoose");
const Food= require('./models/food');
const Contact = require('./models/contacts');
const Comment = require('./models/comments');


dbURL = 'mongodb://localhost:27017/foodblog';

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(function(result){
    console.log("Connected")
}).catch(function(err){
    console.log("error")
});



var app = express();
var folder = path.join(__dirname + 'files');
if(!fs.existsSync(folder)){
    fs.mkdirSync(folder)
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use(express.static('public'));
app.use(methodOverrride("_method"));
app.use(express.static('files'));


app.get("/", function(req,res){
    Food.find({}).then(function(result){
        res.render('index', {foodss: result});
    }).catch(function(err){
        console.log(err);
    })
    
});
app.post("/", function(req,res){
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/files/' + file.name;
    });
    form.parse(req, (err, fields, files) => {
        const imgAddress = files.image.name;
        const newC = {name: fields.name, image: imgAddress, ingredients: fields.ingredients, procedures: fields.procedures}
    Food.create(newC).then(function(result){
        console.log(result)
        res.redirect('/');
    }).catch(function(err){
        console.log(err);
    })
})
});

app.get("/about", function(req,res){
    res.render('about');
})
app.post("/comment/:id", function(req,res){
    var _id = req.params.id;
    Food.findById(_id).then(function(found){
        Comment.create(req.body.food).then(function(result){
            found.comment.push(result);
            res.redirect('/' + _id);
            console.log(result);
            found.save()
        }).catch(function(err){
            console.log(err)
        }).catch(function(err){
            console.log(err)
        })
    })
})

app.get("/contact", function(req,res){
    Contact.find({}).then(function(result){
        res.render('./admin/contact', {contacts: result});
    }).catch(function(err){
        console.log("Somthing Went Wrong ")
    })
    
})
app.get("/contact/new", function(req,res){
    res.render('newcontact');
})
app.post("/contact", function(req,res){
    Contact.create(req.body.food).then(function(result){
        console.log(result);
     
        res.redirect('/');
        
    }).catch(function(err){
        console.log(err)
    }) 
    
});
app.get("/controls", function(req,res){
    res.render('./admin/control');
});

app.get('/singles/:id/edit', function(req,res){
    Food.findById(req.params.id).then(function(result){
        res.render('/admin/controls/'+ req.params.id);
    })
})

app.delete("/contact/:id", function(req,res){
    Contact.findByIdAndDelete(req.params.id).then(function(result){
        console.log(result);
        res.redirect('/contact');
    }).catch(function(err){
        console.log(err)
    }) 
    
});
app.delete("/singles/:id", function(req,res){
    Food.findByIdAndDelete(req.params.id).then(function(result){
        console.log(result);
        res.redirect('/');
    }).catch(function(err){
        console.log(err)
    }) 
    
})

app.get("/services", function(req,res){
    res.render('services');
})
app.get("/new", function(req,res){
    res.render('./admin/new');
})

app.get("/:id", function(req,res){
    Food.findById(req.params.id).populate("comment").exec().then(function(result){
        res.render('single',  {foodss: result} );
    }).catch(function(err){
        res.send("Somthing Went Wrong")
    })
   
})



app.listen(8000);