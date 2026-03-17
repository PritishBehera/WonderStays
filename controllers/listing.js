const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allLists= await Listing.find({});
    res.render("./listings/index.ejs",{allLists});
};

module.exports.newListingForm = (req,res)=>{
    res.render("./listings/newList.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing got Created.");
    res.redirect("/listings");
};

module.exports.editForm = async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    if(!list){
        req.flash("error","Requested Listing Doesn't Exist.");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs",{list});
    }
};

module.exports.updateListing = async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Upadated Successfully.")
    res.redirect(`/listings/${id}`);
};

module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    let list= await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    if(!list){
        req.flash("error","Requested Listing Doesn't Exist.");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs",{list});
    }
};

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedVal=await Listing.findByIdAndDelete(id);
    console.log(deletedVal);
    req.flash("success","Deleted Successfully.");
    res.redirect("/listings");
};