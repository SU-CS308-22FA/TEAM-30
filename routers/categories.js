const express= require('express');
const router= express.Router(); 
const {Category}= require('../models/category');

router.get('/', async (req,res)=>{
    const CategoryList= await Category.find();
    if(!CategoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(CategoryList);
})
router.get('/:id', async (req,res)=>{
    const cat= await Category.findById(req.params.id);
    if(!cat){
        res.status(400).json({success:false})
    }
    res.status(200).send(cat);
})

router.post('/',async (req,res)=>{
    let cat= new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color, 
    })
    cat= await cat.save();
    if(!cat){
        return res.status(404).send("Category can't be created!")
    }
    res.send(cat);
    
    });
router.put('/:id', async(req,res)=>{
    const cat= await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        }
        ,{new : true}
    )
        if(!cat){
            return res.status(400).send('Category cant be created');
        }
        res.send(cat);
})
router.delete('/:id',(req,res)=>{
    Category.findByIdAndRemove(req.params.id).then(cat=>{
        if(cat){
            return res.status(200).json({success:true,message:"Category is Deleted"})
        }else{
            return res.status(404).json({success:false, message:"Faileddddd"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error:err})
    })
});
router.get('/get/count', async (req,res)=>{
    const catCount = await Category.countDocuments();
    if(!catCount){
        res.status(500).json({success:false})
    }
    res.send({
        count: catCount,
    });
})

    module.exports =router;