const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
// const {listingSchema} = require("../schema.js");
// const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} =require("../middleware.js");
const listingControllers = require("../controllers/listing.js");

router.route("/new")
    //create new list route
    .get(isLoggedIn,listingControllers.newListingForm)
    .post(
    isLoggedIn,
    validateListing, wrapAsync(listingControllers.createListing));

//main route
router.get("/",wrapAsync(listingControllers.index));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editForm));

router.route("/:id")
    //update route
    .put( isLoggedIn,isOwner,wrapAsync(listingControllers.updateListing))
    //show route
    .get(wrapAsync(listingControllers.showListing))
    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing));


module.exports = router;