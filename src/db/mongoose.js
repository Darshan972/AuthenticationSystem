const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,

}) // this(useCreateIndex) willl make sure that mongoose works with mongodb , indexes are created allowing us to quickle access the data we need to access// to connect to database



