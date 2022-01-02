const nodemailer = require('nodemailer');

const nodeMailerAPIKey = ''

nodemailer.setApiKey(nodeMailerAPIKey)

nodemailer.send({
    to: 'd2046429@gmail.com',
    from: 'd2046429@gmsil.com',
    subject: 'This is my first creation!',
    text: 'I hope this one actually get to you.'
})