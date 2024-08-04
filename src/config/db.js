const mongoose = require("mongoose");

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log("Reusing existing database connection");
    }
    else if (!cachedDb || mongoose.connection.readyState !== 1) {
        cachedDb = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    }
}

module.exports = connectToDatabase;
