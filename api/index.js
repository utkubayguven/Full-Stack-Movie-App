const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const movieRoute = require("./routes/movies")
const listRoute = require("./routes/lists")

dotenv.config();
mongoose.set('strictQuery', false);
mongoose
//process.env.MONGO_URL
    .connect("mongodb://localhost:27017/mydatabase",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(()=>console.log("DB Connection Successful!"))
    .catch((err)=> console.log(err));

app.use(express.json())
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);




app.listen(8000,()=>{
    console.log("Backend server working...")
});