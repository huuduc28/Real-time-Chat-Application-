const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const account = new Schema(
    {
        _id: { type: String, required: true },
        fullName: { type: String, required: true },
        avatar: { type: String },
        status: { type: Boolean },
        email: { type: String},
        password: { type: String },
        clientID: { type: String}
    },
)

module.exports = mongoose.model('Account', account);