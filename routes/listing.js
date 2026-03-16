const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
// const {listingSchema} = require("../schema.js");
// const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} =require("../middleware.js");
const listingControllers = require("../controllers/listing.js");


//main route
router.get("/",wrapAsync(listingControllers.index));

//create new list route
router.get("/new",isLoggedIn,listingControllers.newListingForm);

router.post("/new",
    isLoggedIn,
    validateListing, wrapAsync(listingControllers.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.editForm));


//update route
router.put("/:id", isLoggedIn,isOwner,wrapAsync(listingControllers.updateListing));

//show route
router.get("/:id",wrapAsync(listingControllers.showListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControllers.destroyListing));


module.exports = router;