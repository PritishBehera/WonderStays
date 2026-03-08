const express= require("express");
const app = express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const expressError = require("./utils/expressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/publics")));

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
    .then(()=>{
        console.log("connected to DB WonderStays")
    })
    .catch(err=>{
        console.log(err);
        
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderstays");
};

app.get("/",(req,res)=>{
    console.log("i am groot");
    
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.use((req,res,next) => {
    if(!res.headersSent){
    next( new expressError(404,"Page Not Found"));
    }
});

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
    
});