const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ak7859437:lUdNj7EzHx6ItZfx@clusterlove.uvn8cgb.mongodb.net/LMS?retryWrites=true&w=majority&appName=ClusterLove"
    );
    console.log("LMS Db is connected");
  } catch (e) {
    console.log("Error in connecting to the db");
    console.error(e.message);
  }
};
