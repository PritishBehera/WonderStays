const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

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
router.get("/new",(req,res)=>{
    res.render("./listings/newList.ejs");
});

router.post("/new",validateListing, wrapAsync(async(req,res,next)=>{
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("successList","New Listing got Created.");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    res.render("./listings/edit.ejs",{list});
}));


//update route
router.put("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    console.log(id);
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    res.redirect(`/${id}`);
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{list});
}));

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedVal=await Listing.findByIdAndDelete(id);
    console.log(deletedVal);
    res.redirect("/listings");
}));


module.exports = router;