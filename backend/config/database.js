const mongoose = require('mongoose');
const env = require('./env');
const dbURI = env.mongoURI;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database connection error: ', err));
