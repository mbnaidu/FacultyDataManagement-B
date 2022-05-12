const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Madhu:LgB4ZsoiqWwUqsvj@facultydatamanagement.qfnsy.mongodb.net/studentDataBase?retryWrites=true&w=majority",
    err => {
        if (err) throw err;
        console.log('connected to MongoDB')
    });
// LgB4ZsoiqWwUqsvj