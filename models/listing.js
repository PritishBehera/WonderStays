const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        // type:String,
        // default:"D:\MajorProject\images\pexels-dorjan-frrokaj-118638963-11703240.jpg",
        // set:(v)=> v===" "
        //     ?"D:\MajorProject\images\pexels-dorjan-frrokaj-118638963-11703240.jpg"
        //     : v,
        // filename:String,
        // url:String,
        type:String,
        default:"https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDlete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews }});
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;