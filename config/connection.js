const mongoose = require("mongoose");
require('dotenv').config()
;


const connectDB = async () => {
    try {
         await mongoose.connect(process.env.DB_URI, {useNewUrlParser : true , useUnifiedTopology : true});
        console.log("connected to the database");
    } catch (error) {
        console.log(11,error);
        process.exit(1);
    }
};

module.exports = connectDB;