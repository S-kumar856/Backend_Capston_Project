const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const userRoute = require('./routes/user')
const jobRoute = require('./routes/job')
const bodyParser = require('body-parser')
dotenv.config();
const port = process.env.PORT || 3000;
const path = require("path");

app.use(express.static(path.join(__dirname,"public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public","try.html"));
    // res.send('Hello World!')
});

// middelwares & routers
app.use(express.urlencoded({ extended:true }));
app.use(bodyParser.json())
app.use('/api/user', userRoute)
app.use('/api/job', jobRoute)

app.listen(port, () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err) => {
        console.log(err);
    })
    console.log(`Server is running on port ${port}`);
});

