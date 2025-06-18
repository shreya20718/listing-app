const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review = require('./review.js'); 
const User = require('./user.js');

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {

    url: String,
    filename:String,
    
  },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },

    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        
    },
    category:{
        type: String,
        enum: ["mountain", "castles","farms","pools","snow area","camping","rooms","city","dome","beach"],
    }
})

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;