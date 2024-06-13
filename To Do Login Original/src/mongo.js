const mongoose=require("mongoose")
  
const getdataBase=()=>{
    mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})
}









module.exports={getdataBase};
