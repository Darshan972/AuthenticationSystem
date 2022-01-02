const request = require("supertest")
const Task = require('../src/models/Task')
const app = require('../src/app')
const {userOneId ,taskOne,taskTwo,taskThree, userOne ,userTwo, setupDatabase} = require('./fixtures/db')
const { send } = require("./__mocks_/@sendgrid/mail")


beforeEach(setupDatabase)

test('Should create task for user' , async()=>
{
 const response = await request(app)
 .post('/tasks')
 .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
 .send({
     description: 'From my fest'
 })
 .expect(201)
 const task = await Task.findById(resposne.body._id)
 expect(task).not.toBeNull()
 expect(task.completed).toEqual(false)
})

test('Should return the tasks of userOne' , async()=>
{
 const response = await request(app)
 .get('/tasks')
 .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
 .send()
 .expect(200)

 expect(response.body.length).toEqual(2)
})

test('attempt by second user to delete userOne task' , async()=>
{
    const response = await request(app)
    .delete('/tasks/'+taskOne._id)
    .set('Authorization' , 'Bearer '+userTwo.tokens[0].token)
    .send()
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})