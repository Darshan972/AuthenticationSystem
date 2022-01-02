const request = require('supertest')
const app = require('../src/app')
const User = require('../src/User')


const {userOneId , userOne , setupDatabase} = require('./fixtures/db')


beforeEach(setupDatabase)

test('should signup a new user' , async () =>
{
    //send allows us to provide an object containing our data
    const response = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'duggal12@gmail.com',
        password: 'pass@123'
    }).expect(201)
    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(resposne.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'duggal12@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('pass@123')
})

test('Should log in existing user' , async() =>
{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(201)
    const user = await User.findById(userOneId)
    expect(resposne.body.token).toBe(resposne.body.tokens[1].token)
})

test('Should not login non-existing user' , async() =>
{
    await request(app).post('/users/login').send({
        email: 'Your Mail',
        password: 'Your Password'
    }).expect(400)
})

test('Should get profile for user ' , async() =>
{
    await (await request(app)
    .get('/users/me'))
    .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
    .send().expect(201)
})

test('Should not get profile for not authenticated user ' ,async() =>
{
    await request(app)
         .get('/users/me')
         .send()
         .expect(400)
})

test('Should delete account of existing user' , async() =>
{
    await request(app).delete('/users/me')
        .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
        .send()
        .expect(201)
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Should not delete account of non-existing user' , async() =>
{
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image' , async() =>
{
    await request(app).post('/users/me/avatar')
    .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
    .attach('avatar' , 'tests/fixtures/philly.jpg')
    .expect(201)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields' , async()=> {
    await request(app)
    .patch('/users/me')
    .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
    .send({
        name: 'Jess'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid user fields' , async()=> {
    await request(app)
    .patch('/users/me')
    .set('Authorization' , 'Bearer '+userOne.tokens[0].token)
    .send({
        location: 'Mumbai'
    })
    .expect(400)
})