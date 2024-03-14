const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://appfcontaduria:Fup1234.@cluster1.dyjsmeu.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));