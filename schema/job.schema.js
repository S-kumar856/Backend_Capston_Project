const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    logoUrl:{
        type:String,
        required:true
    },
    jobPosition: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    jobType:{
        type: String,
        required: true,
        enum:["full-time","part-time","contract", "internship","freelancer"]
    },
    remote:{
        type:String,
        required:true,
        enum:["Home","Office","Hybrid"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    jobDescription:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    skills:{
        type:Array,
        required:true
    },
   aboutCompany:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model("Job", jobSchema);