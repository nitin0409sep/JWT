// database connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const DB = "mongodb+srv://username:<Password>>@cluster0.zxw4y5a.mongodb.net/db?retryWrites=true&w=majority"

mongoose.connect(DB).then(() => {
    console.log("Connection Successfull")
}).catch((err) => console.log(err));
