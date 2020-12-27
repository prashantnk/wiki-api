const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");
const app = express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB" , 
{ useNewUrlParser: true , useUnifiedTopology: true} );

const articleSchema = new mongoose.Schema({
    title : String ,
    content : String
});

const Article = new mongoose.model("article" , articleSchema);
app.get("/articles" , (req , res)=>{
    Article.find({} , (err , articles)=>{
        if(!err)res.send(articles);
        else res.send(err);
    })
});
app.post("/articles" , (req , res) =>{
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
        title : title,
        content : content
    })
    article.save(err =>{
        if(err) res.send(err);
        else res.redirect("/articles");
    });
});
app.delete("/articles" , (req,res)=>{
    Article.deleteMany({} , (err)=>{
        if(err) res.send(err);
        else res.send("success");
    })
});

app.route("/articles/:title")
.get((req,res)=>{
    Article.findOne({title : req.params.title} , (err , article)=>{
        if(article) res.send(article);
        else res.send("404! NOT FOUND");
    });
})
.put((req , res)=>{
    Article.replaceOne({title : req.params.title} , req.body , err =>{
        if(err) res.send(err);
        else res.send("updated!");
    })
})
.patch((req , res)=>{
    Article.updateOne({title : req.params.title} , req.body , err =>{
        if(err) res.send(err);
        else res.send("updated!");
    })
})
.delete((req,res)=>{
    Article.deleteOne({title : req.params.title} , err =>{
        if(err) res.send(err);
        else res.send("deleted!");
    })
});
app.listen(3000 , ()=>{
    console.log("server started at 3000");
});

