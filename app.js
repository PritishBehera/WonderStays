const express= require("express");
const app = express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/publics")));

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

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
    
}

// app.get("/testListing",async(req,res)=>{
//     let listing1= new Listing({
//         title:"Loop house",
//         description:"for the happy stayers",
//         price:4000,
//         location:"Jungeltar, Chennai",
//         country:"India"
//     });
//     await listing1.save();
//     res.send("success full");
// });

//main route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allLists= await Listing.find({});
    res.render("./listings/index.ejs",{allLists});
}));

//create new list route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/newList.ejs");
});

app.post("/listings/new",validateListing, wrapAsync(async(req,res,next)=>{
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    res.render("./listings/edit.ejs",{list});
}));


//update route
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    console.log(id);
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    res.redirect(`/listings/${id}`);
}));

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    res.render("./listings/show.ejs",{list});
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedVal=await Listing.findByIdAndDelete(id);
    console.log(deletedVal);
    res.redirect("/listings");
}));



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