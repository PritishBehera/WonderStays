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
        default:"https://images.unsplash.com/photo-1499793983690-e2…wfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
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
    ]
});

listingSchema.post("findOneAndDlete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews }});
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;