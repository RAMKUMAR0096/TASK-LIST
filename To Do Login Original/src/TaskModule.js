/*const mongoose=require('mongoose')

const TaskSchema=new mongoose.Schema({
    task:String,
    userId:{
        type: mongoose.Schema.Types.ObjectId, // Specifies that this field will store an ObjectId
        required: true // or false depending on your requirement
    }
})
const TaskModule=new mongoose.model('usertask',TaskSchema)

module.exports=TaskModule;*/

//to convert to string to objectId

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Check if the model already exists
const TaskModule = mongoose.models.usertask || mongoose.model('usertask', new Schema({
    task: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}));

module.exports = TaskModule;
