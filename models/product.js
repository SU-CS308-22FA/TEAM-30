const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    description:{
        type:String,
        required:true,
    },
    richDescription:{
        type: String,
        required:false,
        default:'',
    },
    image:{
        type:String,
        default:'',
        required: false,
    },
    images: [{
        type: String,
    }],
    team:{
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min:0,
    },
    price: {
        type: Number,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true,
    },
    rating:{
        type: Number,
        default:0,
    },
    numReviews:{
        type: Number,
        default:0,
    },
    isFeatured:{
        type: Boolean,
        default:false,
    },
    isDiscounted:{
        type:  Boolean,
        default: false,
    },
    dateCreated:{
        type:Date,
        default: Date.now,
    },
    size:{
        type: String,
        required: true,
    },
    
})
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
productSchema.set('toJSON',{
    virtuals:true,
});

exports.Product = mongoose.model('Product', productSchema);
