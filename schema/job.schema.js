const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName:{
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
        enum:["full-time","part-time","contract", "internship","freelance"]
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
    jobRequirements:{
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
    Company:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model("Job", jobSchema);