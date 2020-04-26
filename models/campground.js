var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   kategorija: String,
   cena: Number,
   creator: String,
   image: String,
   imageId: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);