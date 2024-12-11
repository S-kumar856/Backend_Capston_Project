const express = require('express');
const router = express.Router();
const Job = require('../schema/job.schema');
const authMiddleware = require('../middlewares/auth')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// reading the all jobs  (creating pagination using offset, limit)
router.get('/', async (req, res) => {
    const { offset, limit, salary, name } = req.query;

    // mongo query
    const query = {};
    if (salary){
        query.salary = { $gte: salary, $lte: salary }
    }

    if(name){
        query.companyName = {$regex: name, $options:"i"}
    }

    // get me job with salary between 200 and 300
    //    {salary: { $gte: 200, $lte:300}} this code of searching with salary 
    // skip(offset).limit(limit) this code pagination 

    // const jobs = await Job.find({salary: { $gte: 200, $lte:300}}).skip(offset).limit(limit);

    // const jobs = await Job.find({salary}).skip(offset).limit(limit);

    // const jobs = await Job.find({companyName: { $regex: name, $options: "i"}}).skip(offset).limit(limit);
    const jobs = await Job.find(query).skip(offset || 0).limit(limit || 20);
    res.status(200).json(jobs)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id)
    if(!job){
        return res.status(404).json({message: "Job not found"})
    }
    res.status(200).json(job)
});

// delete the job
router.delete('/:id',authMiddleware, async(req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    const userId  = req.user.id;

    if(!job){
        return res.status(404).json({message: "Job not found"})
    }

// check if the user is the owner of the job
    if(userId !== job.user.toString()){   
        return res.status(403).json({message: "You are not authorized to delete this job"})
    }
    await Job.deleteMany({_id:id})
    res.status(200).json({message:"Job deleted"});

})

// creating the job
router.post('/', authMiddleware, async(req, res) => {
    const { companyName, jobPosition, salary, jobType, jobDescription, jobRequirements, location, skills, Company} = req.body;
    if(!companyName || !jobPosition || !salary || !jobType){
        return res.status(400).json({message:"Missing required fields"})
    }
    try {
        const user = req.user;
        const job = await Job.create({
            companyName,
            jobPosition,
            salary,
            jobType,
            jobDescription,
            jobRequirements,
            location,
            skills,
            Company,
            user: user.id,
        });
        res.status(200).json(job);
        
    } catch (err) {
        console.log(err)
        res.status(500).json({message:"Error in creating a job"})
    }

});

// updating the job details
router.put('/:id', authMiddleware, async(req,res) => {
    const { id } = req.params;
    const { companyName, jobPosition, salary, jobType, jobDescription, jobRequirements, location, skills, Company } = req.body;
    const job = await Job.findById(id);
    if(!job){
        return res.status(404).json({message: "Job not found"})
    }
    if(job.user.toString() !== req.user.id){
        return res.status(403).json({message: "You are not authorized to update this job"})
    }

    try{
        await Job.findByIdAndUpdate(id,{
            companyName,
            jobPosition,
            salary,
            jobType,
            jobDescription,
            jobRequirements,
            location,
            skills,
            Company,
        })
        res.status(200).json({message:"Job Updated"});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Error in finding job"})
    }
})

module.exports = router;
