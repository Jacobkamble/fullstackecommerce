const mongoose = require("mongoose");

const options = {


    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
};

const connectDatabase = async () => {

    const db = await mongoose.connect(process.env.DB_URI, options)

    console.log("Mongodb connected with server :", db.connection.host)


}


module.exports = connectDatabase