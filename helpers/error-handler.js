function errorHandler(err,req,res,next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json({message:'User is not authorized'})
    }
    if(err.name==='ValidationError'){
        res.status(401).json({message:err})
    }
    return res.status(500).json({message:err})
}
module.exports = errorHandler;