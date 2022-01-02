require('../src/db/mongoose');
const Task = require('../src/models/task')

// Task.findByIdAndDelete('61acd03e1469dfefa13df75f').then((task) =>
// {
//     console.log(task);
//     return Task.countDocuments({completed: false})
// }).then((results) => {
//     console.log(results);
// }).catch((e) =>
// {
//     console.log(e);
// })

const deleteTaskAndCount = async (id) =>
{
 const delte = await Task.findByIdAndDelete(id)
 const count = await Task.countDocuments({completed:false})
 return count
}

deleteTaskAndCount('61acd06cefd32cf9b5d4f7b9').then((count) => {
    console.log(count);
}).catch((e) =>
{
    console.log(e);
})