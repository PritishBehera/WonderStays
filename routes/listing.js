const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} =require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
    
};

//main route
router.get("/",wrapAsync(async (req,res)=>{
    const allLists= await Listing.find({});
    res.render("./listings/index.ejs",{allLists});
}));

//create new list route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/newList.ejs");
});

router.post("/new",
    isLoggedIn,
    validateListing, wrapAsync(async(req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing got Created.");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    if(!list){
        req.flash("error","Requested Listing Doesn't Exist.");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs",{list});
    }
}));


//update route
router.put("/:id", isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Upadated Successfully.")
    res.redirect(`/listings/${id}`);
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id).populate("reviews").populate("owner");
    if(!list){
        req.flash("error","Requested Listing Doesn't Exist.");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs",{list});
    }
}));

//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedVal=await Listing.findByIdAndDelete(id);
    console.log(deletedVal);
    req.flash("success","Deleted Successfully.");
    res.redirect("/listings");
}));


module.exports = router;