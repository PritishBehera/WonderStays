const Listing = require("../models/listing");
const mapKey = process.env.MAP_KEY;
module.exports.index = async (req,res)=>{
    const allLists= await Listing.find({});
    res.render("./listings/index.ejs",{allLists});
};

module.exports.newListingForm = (req,res)=>{
    res.render("./listings/newList.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let location = req.body.listing.location;
    const geoCodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapKey}`;
    const response = await fetch(geoCodingUrl);
    const data = await response.json() ;
    // console.log( data.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = data.features[0].geometry;
    let saved = await newListing.save();
    console.log(saved);
    
    req.flash("success","New Listing got Created.");
    res.redirect("/listings");
};

module.exports.editForm = async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    if(!list){
        req.flash("error","Requested Listing Doesn't Exist.");
        res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_300");
    res.render("./listings/edit.ejs",{list,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let location = req.body.listing.location;
    const geoCodingUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapKey}`;
    const response = await fetch(geoCodingUrl);
    const data = await response.json() ;
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    listing.geometry= data.features[0].geometry;
    await listing.save();
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    };
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