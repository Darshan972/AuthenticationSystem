require('../src/db/mongoose');
const { countDocuments } = require('../src/models/user');
const User = require('../src/models/user')

// User.findByIdAndUpdate('61acd539f6de5ca0e9da2dfa' , {age: 1}).then((user) =>
// {
//     console.log(user);
//     return User.countDocuments({ age: 1})
// }).then((results) => 
// {
//     console.log(results);
// }).catch((e) =>
// {
//     console.log(e);
// })

const updateAgeAndCount = async(id,age) =>
{
 const user = await User.findByIdAndUpdate(id , {age})
 const count = await User.countDocuments({age})
 return count
}

updateAgeAndCount('61acd539f6de5ca0e9da2dfa' , 2).then((count) =>
{
    console.log(count);
}).catch((e) =>
{
    console.log(e);
})