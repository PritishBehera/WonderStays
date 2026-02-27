const mongoose = require("mongoose");
const Schema= mongoose.Schema;

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
        default:"https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?cs=srgb&dl=pexels-pixabay-237272.jpg&fm=jpg"
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;