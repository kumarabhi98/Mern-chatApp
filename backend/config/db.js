const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log(`mongoDM connected ${conn.connection.host}`);
    }
    catch(error){
        console.log(`error : ${error.message}`);
    }
}

module.exports = connectDB;