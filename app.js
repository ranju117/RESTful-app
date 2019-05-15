var express=require("express");
var methodOverride=require("method-override");
var app=express();
var bp=require("body-parser");
var mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");
mongoose.connect("mongodb://localhost/restfulBlog");
var blogSchema=new mongoose.Schema(
    {title: String,
    image: String,
    body: String,
    created : {type:Date, default: Date.now()}
    }
    );
var blog=mongoose.model("blog",blogSchema);
/*blog.create({
    title:"MS Dhoni",
    image:"https://live.staticflickr.com/3669/8879316324_3d56f3a56d.jpg",
    body:"Mahendra Singh Dhoni is an Indian international cricketer who captained the Indian national team in limited-overs formats from 2007 to 2016 and in Test cricket from 2008 to 2014."
    
    
},function(err,blog){
    if(err){console.log(err);}
    else{
        
       console.log("added"); 
    }
});*/
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
app.get("/blogs",function(req, res) {
    blog.find({},function(err,blogs){
        if(err){console.log(err);}
        else{
      console.log(blogs);      
   res.render("index",{blogs:blogs});             
        }
        
        
    });

});
app.get("/blogs/new",function(req, res) {
   res.render("new"); 
});
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,blog){
        if(err){console.log(err);}
        else
        {
            res.redirect("/blogs");
        }
        
    });
    
});
app.get("/blogs/show/:id",function(req, res) {

  
   blog.findById(req.params.id,function(err,blog){
      if(err){console.log(err);}
      else{
          
          res.render("display",{blog:blog});
       
   }
});
});
app.get("/blogs/:id/edit",function(req, res) {
   
blog.findById(req.params.id,function(err,blog){
   if(err){
       console.log(err);
   } 
   else
   {
res.render("update.ejs",{blog:blog});       
   }
});

});
app.put("/blogs/:id",function(req, res) {
req.body.blog.body=req.sanitize(req.body.blog.body);
blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
   if(err){
       console.log(err);
   } 
   else
   {
res.redirect("/blogs");       
   }
});

});
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,req.body.blog,function(err,blog){
        if(err){console.log(err);}
        else{
            
            res.redirect("/blogs");
        }
        
    });
    
});
app.listen(process.env.PORT,process.env.IP,function(){console.log("Server started!");});