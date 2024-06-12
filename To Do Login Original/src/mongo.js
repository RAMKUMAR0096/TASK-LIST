const mongoose=require("mongoose")
  
const getdataBase=()=>{
    mongoose.connect("mongodb+srv://ramkumar:ramkumar%4096@cluster0.hlx15pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})
}









module.exports={getdataBase};
