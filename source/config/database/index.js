const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            dbName: process.env.DBNAME,
            useUnifiedTopology: true,
        })
        console.log('Connect successful to database')
    }
    catch (err) {
        console.log('Connect database error')
        console.log(err)
    }
}

module.exports = { connect };
