const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/tasks");
const app = express();
const port = process.env.PORT || 3000;





app.use(express.json()); //it will automatically parse the incoming json to object so we can easily access it
app.use(userRouter);
app.use(taskRouter);

// const Task = require("./models/Task");
// const User = require("./models/User")
// const main = async() =>
// {
// //const task = await Task.findById('61b734dfc24939b11de73806')
// /**Populate allows us to populate data from a relationship suchas the data we have right here for the owner */
// //await task.populate('owner').execPopulate()/*this line will find the owner associated with this task and owner will now be their profile , 
// //the entire document , aas opposed to just being the ID.*/
// //console.log(task.owner)

// }

// main()

module.exports = app