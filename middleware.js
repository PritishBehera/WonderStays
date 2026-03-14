const Listing = require("./models/listing.js")
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to perform any kind of operation on listing!");
        return res.redirect("/login");
    };
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission for make changes to this listing.");
        res.redirect(`/listings/${id}`);
        return;
    };
    next();
};
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
    
};