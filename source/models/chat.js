const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chat = new Schema(
    {
        idUserSend: { type: String, required: true },
        idUserReceive: { type: String, required: true },
        msg: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Chat', chat);