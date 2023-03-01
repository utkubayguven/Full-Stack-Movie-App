const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")

dotenv.config();
mongoose.set('strictQuery', false);
mongoose
//process.env.MONGO_URL
    .connect("mongodb://localhost:27017",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(()=>console.log("DB Connection Successful!"))
    .catch((err)=> console.log(err));

app.use(express.json())
app.use("/api/auth", authRoute);

app.listen(8000,()=>{
    console.log("Backend server working...")
});