const listing=require("../models/listing.js");


module.exports.index=async (req,res)=>{
    const alllisting= await listing.find({});
 res.render("listings/index.ejs",{alllisting});
  };

  module.exports.new=async (req,res)=>{

      res.render("listings/new.ejs");
  }

  module.exports.show=async (req,res)=>{
    const {id}=req.params;
        const newlisting=await listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner");
        if (!newlisting) {
          
          req.flash("error", "Listing does not exist");
          res.redirect("/listings");
        }
        console.log(newlisting);
        res.render("listings/show.ejs",{ listing: newlisting});
  };

  module.exports.create=async (req,res)=>{
  let url=req.file.path;
  let filename=req.file.filename;

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the current user
    newListing.image = { url, filename }; // Set the image field with the uploaded file details
 await newListing.save();
    req.flash('success', 'New Listing created successfully!');
    res.redirect("/listings");
  }

  module.exports.edit=async (req,res)=>{
     const {id}=req.params;
        const newlisting=await listing.findById(id);
     
let originalurl=newlisting.image.url;
originalurl=originalurl.replace("/upload","/upload/w_300/h_300");
 res.render("listings/edit.ejs",{ listing: newlisting,originalurl});

  }

module.exports.update=async (req,res)=>{
     const {id}=req.params;
     let Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
     if(typeof req.file !=="undefined") {
  let url=req.file.path;
  let filename=req.file.filename;
  Listing.image = { url, filename }; 
  await Listing.save();
     }
     
    req.flash('success', ' Listing updated!');
     res.redirect(`/listings/${id}`);

}

module.exports.delete=async (req,res)=>{
    const {id}=req.params;
  let deletedlisting =  await listing.findByIdAndDelete(id);
  console.log(deletedlisting);
   req.flash('success', ' Listing Deleted successfully!');
  res.redirect("/listings");
}


