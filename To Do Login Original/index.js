const express = require("express");
const session = require('express-session');
const path = require("path");
const app = express();
const hbs = require("hbs");
const LogInCollection = require("./src/LogInCollection");
const TaskModule = require('./src/TaskModule');
const DB = require("./src/mongo")
const port = process.env.PORT || 3000

DB.getdataBase();
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: 'your_secret_key' }));  // For session security

const tempelatePath = path.join(__dirname, '/tempelates')
const publicPath = path.join(__dirname, '/public')
//console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))



//hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



app.get('/home', async (req, res) => {
    const userID = req.session.userID;
    //console.log(typeof(userID))

    const tasks = await TaskModule.find({ userId: userID });
    let edit_id;
    let edit_task;
    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        // edit_task = await collection.findOne({ _id: new ObjectId(edit_id) });
        edit_task = await TaskModule.findOne({ _id: edit_id })
    }
    if (req.query.delete_id) {
        delete_id = req.query.delete_id;
        // await collection.deleteOne({ _id: new ObjectId(delete_id) });
        await TaskModule.deleteOne({ _id: delete_id })
        return res.redirect('/home?status=3'); // Return here to prevent further execution
    }
    //console.log(tasks);
    res.render('home', { tasks, edit_id, edit_task })
})

app.post('/signup', async (req, res) => {

    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        name: req.body.name,
        password: req.body.password
    }
    // await LogInCollection.save(data)

    const checking = await LogInCollection.findOne({ name: req.body.name })

    try {

        if (checking.name === req.body.name && checking.password === req.body.password) {
            //console.log("if")
            res.sendFile(path.join(__dirname, 'tempelates', 'error_signup.html'));
        } else {
            // console.log("else")
        }


    }
    catch {
        // res.send("wrong inputs")
        //console.log("else")
        await LogInCollection.insertMany([data]);
       // console.log("insert data success")
        res.status(201).redirect("/")
    }



})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            const userID = check._id;
            // console.log(userID);
            req.session.userID = userID;
            const tasks = await TaskModule.find({ userId: userID });

            //console.log(check._id)
            res.status(201).render("home", { naming: `${check._id}`, tasks })   //${req.body.password}+${req.body.name}+
        }

        else {
            res.render("incorrect_pass");
        }


    }

    catch (e) {
        //console.log(e)
        res.render("incorrect_pass")


    }


})

app.post('/store_task', async (req, res) => {

    try {
        //database = await dbo.getDatabase();
        //const collection = database.collection('task');

        /* const mongoose = require('mongoose');
 const schema = mongoose.Schema;
 
 // Define your schema
 const TaskSchema = new schema({
     task:{
         type:String,
         required:true
     },
     userId: {
         type: String, // Define the type as String
         required: true // Optional: specify if it's required
     },
     // other fields of your schema
 });
 
 // Define a pre-save hook to convert the string to ObjectId before saving
 TaskSchema.pre('save', async function(next) {
     // If the objectIdField is provided and it's not already an ObjectId
     if (this.objectIdField && !mongoose.Types.ObjectId.isValid(this.objectIdField)) {
         try {
             // Convert the string to an ObjectId
             this.objectIdField = mongoose.Types.ObjectId(this.objectIdField);
         } catch (error) {
             // Handle any conversion errors
             return next(error);
         }
     }
     next();
 });
 
 // Create a model from the schema
 const TaskModule = mongoose.model('usertask',TaskSchema);
         const taskfrompage={ task: req.body.task,userId:req.body.user_id}
 
         const task = await TaskModule.insertMany([taskfrompage]);*/
        // task.save();
        // console.log('stored success')










        // Assuming `req.body.task` and `req.body.user_id` contain the task and userId respectively
        const taskFromPage = { task: req.body.task, userId: req.body.user_id };

        // Create a new task document and save it
        try {
            const task = await TaskModule.create(taskFromPage);

            //console.log('Task stored successfully');
            return res.redirect("/home/?status=1");
        } catch (error) {
            console.error('Error storing task:', error);
            return res.status(500).send('Error storing task');
        }

        // if (!task.task) {
        //     return res.status(400).send('Task is required.'); // Send error response if task is missing
        // } else {
        // await collection.insertOne(task);
        // return res.redirect("home"); // Return here to prevent further execution
        // }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    console.log(req.body.task);
    console.log(req.body.user_id);
    // res.redirect("home")
})

//update task

app.post('/update_task/:edit_id', async (req, res) => {
    try {
        // database = await dbo.getDatabase();
        // const collection = database.collection('task');
        const edit_id = req.params.edit_id;
        await TaskModule.findOneAndUpdate({ _id: edit_id }, { task: req.body.task })
        // const task = { task: req.body.task };
        // await collection.updateOne({ _id: new ObjectId(edit_id) }, { $set: task });
        return res.redirect('/home/?status=2'); // Return here to prevent further execution
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(port, () => {
    console.log('port connected');
})


// await LogInCollection.insertMany([data]);
//     console.log("insert data success")
//     res.status(201).redirect("/")
// if (checking.name === req.body.name && checking.password===req.body.password) {
//     res.sendFile(path.join(__dirname,'tempelates','error_signup.html'))
// }else{
//     console.log("else")
// }