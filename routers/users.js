const express= require('express');
const router= express.Router(); 
const {User}= require('../models/user');
const bcrypt= require('bcryptjs');
const mongoose= require('mongoose');
const jwt= require('jsonwebtoken');
const { json } = require('express');
router.get(`/`, async (req,res)=>{
    const UserList= await User.find().select("-passwordHash");
    if(!UserList){
        res.status(500).json({success:false})
    }
    res.send(UserList);
})
router.get(`/:id`, async (req,res)=>{
    const user= await User.findById(req.params.id).select("-passwordHash");
    if(!user){
        res.status(400).json({success:false})
    }
    res.status(200).send(user);
})   
router.post(`/`,async (req,res)=>{
    let user= new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 8),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,

    })
    user= await user.save();
    if(!user){
        return res.status(404).send("User can't be registered")
    }
    res.send(user);
    
    });
    router.post('/login', async (req,res)=>{
        const user= await User.findOne({email: req.body.email})
        const secret= process.env.secret;
        if(!user){
            return res.status(400).send('User does not exist!')
        }    
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
            const token= jwt.sign(
                {
                    userId: user.id,
                    isAdmin:user.isAdmin
                },secret,{expiresIn : '1d'}
            )
            return res.status(200).send({user: user.email, token: token})
        }else{
            return res.status(400).send('Wrong Credentials!')
        }
    })
    router.post(`/register`,async (req,res)=>{
        let user= new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 8),
            phone: req.body.phone,
            isAdmin: false,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })
        user= await user.save();
        if(!user){
            return res.status(404).send("User can't be registered")
        }
        res.send(user);
        
        });


    router.put('/:id', async(req,res)=>{
        const userExists= await User.findById(req.params.id);
        let newPass;
        if(req.body.password){
            newPass= bcrypt.hashSync(req.body.password,8);
        }else{
            newPass=userExists.passwordHash;
        }
        const user= await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                passwordHash: newPass,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
            },{new : true});
            if(!user){
                return res.status(400).send('User cant be updated');
            }
            res.send(user);
    })
    router.get(`/get/count`, async (req,res)=>{
        const userCount = await User.countDocuments();
        if(!userCount){
            res.status(500).json({success:false})
        }
        res.send({
            count: userCount,
        });
    })

    router.delete('/:id',(req,res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send('Invalid User ID')
        }
        User.findByIdAndRemove(req.params.id).then(user=>{
            if(user){
                return res.status(200).json({success:true,message:"User is Deleted"})
            }else{
                return res.status(404).json({success:false, message:"Faileddddd"})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err})
        })
    });
    
    module.exports =router;