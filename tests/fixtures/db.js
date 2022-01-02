const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/User')
const Task = require('../../src/models/Task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'mike@123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, 'thisismynewcourse')
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Nike',
    email: 'Nike@gmail.com',
    password: 'nike@123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, 'thisismynewcourse')
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOne._id
}


const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completed: true,
    owner: userOne._id
}


const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Three Task',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async() =>
{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoiD,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    userOne,
    setupDatabase
}