const express= require('express');
const { Category } = require('../models/category');
const router= express.Router(); 
const {Product}= require('../models/product');
const mongoose=require('mongoose');
const multer = require('multer');

const FILE_TYPES={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid=FILE_TYPES[file.mimetype];
        let uploadError= new Error('Invalid file type!');
        if(isValid){
            uploadError=null;

        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const filename = file.originalname.split(' ').join('-');
      const extension= FILE_TYPES[file.mimetype];
      cb(null,`${filename}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions= multer({ storage: storage })


/**
 * This function sends a get request to the backend, if there exists products, it builds and returns a list
 * @param {link} input the get-link used by the back-end
 * @returns {productList} a list of all products
 */
router.get(`/`, async (req,res)=>{
    let filter={};
    if(req.query.categories){
        filter= {category:req.query.categories.split(',')}
    }
    const productList = await Product.find(filter);
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
})
/**
 * This function sends a get request to the backend, if there exists a product with given id, it builds and returns the product
 * @param {link} input the get-link used by the back-end, the link also holds the id value in it
 * @returns {product} the wanted product
 */
router.get(`/:id`, async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }
    const cat= await Product.findById(req.params.id).populate('category');
    if(!cat){
        res.status(400).json({success:false})
    }
    res.status(200).send(cat);
})
/**
 * This function sends a post request to the backend. Function also checks the input for allowed doc types, Builds the product with the uploaded image and attrbiutes
 * @param {link} input the post-link used by the back-end.
 * @returns {product} the created variable
 */
router.post(`/`, uploadOptions.single('image') ,async (req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category')
    }
    const file= req.file;
    if(!file){
        return res.status(400).send('Invalid File')
    }
    const fileName= req.file.filename;
    const imgpath= `${req.protocol}://${req.get('host')}/public/uploads/`;
    let prod= new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${imgpath}${fileName}`, 
        price: req.body.price,
        team: req.body.team,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        size:req.body.size,
        countInStock: req.body.countInStock,
        category: req.body.category,
        isFeatured: req.body.isFeatured,
        isDiscounted: req.body.isDiscounted,
    })
    prod= await prod.save()
    if(!prod){
        return res.status(500).send('The product cannot be created');
    }
    res.send(prod)
    });
    /**
 * This function sends a put request to the backend. Function also checks the input for allowed doc types, Updates the wanted product and returns the updated product
 * @param {link} input the put-link used by the back-end.
 * @returns {product} the updated
 */
    router.put('/:id',  uploadOptions.single('image') ,async(req,res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send('Invalid Product ID')
        }
        const category = await Category.findById(req.body.category);
        if(!category){
        return res.status(400).send('Invalid Category')
        }
        const product= await Product.findById(req.params.id);
    if(!product){
        res.status(400).send("Invalid Product!");
    }
    const file= req.file;
    let imagepath;
    if(file){
        const fileName= req.file.filename;
    const imgpath= `${req.protocol}://${req.get('host')}/public/uploads/`;
    imagepath= `${imgpath}${fileName}`;
    }else{
        imagepath=product.image;
    }
         const upd_product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagepath,
                price: req.body.price,
                team: req.body.team,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                size:req.body.size,
                countInStock: req.body.countInStock,
                category: req.body.category,
                isFeatured: req.body.isFeatured,
                isDiscounted: req.body.isDiscounted
            },{new:true}
            );
        
            if(!upd_product){
                return res.status(500).send('Product cant be updated');
            }
            res.send(upd_product);
    });
    /**
 * This function sends a delete request to the backend. If the product exists with the wanted id, Function will return HTTP(200)
 * @param {link} input the delete-link used by the back-end.
 * @returns {HttpResponser} output If deleted succesfully, HTTP(200), if not (404 or 400) 
 */
    router.delete('/:id',(req,res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send('Invalid Product ID')
        }
        Product.findByIdAndRemove(req.params.id).then(prod=>{
            if(prod){
                return res.status(200).json({success:true,message:"Product is Deleted"})
            }else{
                return res.status(404).json({success:false, message:"Faileddddd"})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err})
        })
    });
    /**
 * This function sends a get request to the backend.
 * @param {link} input the get-link used by the back-end.
 * @returns {JSON} A JSON variable with the field count set to the product count
 */
    router.get(`/get/count`, async (req,res)=>{
        const productCount = await Product.countDocuments();
        if(!productCount){
            res.status(500).json({success:false})
        }
        res.send({
            count: productCount,
        });
    })
     /**
 * This function sends a get request to the backend.
 * @param {link} input the get-link used by the back-end.
 * @returns {productList} List of products where isFeatured variable is set to true
 */
    router.get(`/get/featured`, async (req,res)=>{
        const productList = await Product.find({isFeatured:true});
        if(!productList){
            res.status(500).json({success:false})
        }
        res.send(productList);
    })
     /**
 * This function sends a get request to the backend.
 * @param {link} input the get-link used by the back-end.
 * @returns {productList} List of products where isDiscounted variable is set to true
 */
    router.get(`/get/discounted`, async (req,res)=>{
        const productList = await Product.find({isDiscounted:true});
        if(!productList){
            res.status(500).json({success:false})
        }
        res.send(productList);
    })
    router.put('/gallery-images/:id', uploadOptions.array('images', 4), async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }
    
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );
    
        if (!product) return res.status(500).send('the gallery cannot be updated!');
    
        res.send(product);
    });
    
    module.exports =router;