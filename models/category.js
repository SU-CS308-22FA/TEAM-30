const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    color:{
        type:String,
        required:false,
        default:"#000000"
    },
    icon:{
        type:String,
        required:true
    },
});
categorySchema.virtual('id').get(function(){
    return this._id.toHexString();
});
categorySchema.set('toJSON',{
    virtuals:true,
});

exports.Category = mongoose.model('Category', categorySchema);
