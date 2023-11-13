const Chat = require ('../models/chat')
const Account = require('../models/account')

function disconnect(userList, io, socket) {
    socket.on('disconnect', () => {
        console.log(`Client disconnected with ID ${socket.id}`)
        let index 
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].clientId == socket.id) {
                index = i
                break
            }
        }
        userList.splice(index, 1)

        sendUserList (socket, userList)
    })
}

function receiveMessage (io, socket) {
    socket.on('chat:send', async ({msg, idSend}) => {
        const user = socket.request.session.user
        let newChat = new Chat({
            idUserSend: user._id,
            idUserReceive: idSend,
            msg
        })
        // console.log(newChat)
        newChat = await newChat.save()
        // console.log(newChat)
        sendMessage(socket, newChat)
    })
}

async function updateClientID(io, socket) {
    try {
        await Account.findByIdAndUpdate(socket.request.session.user._id, {clientID: socket.id})
    }
    catch (err) {
        console.log(err.message)
    }
}

async function sendMessage(socket, newChat) {
    console.log(newChat)
    //console.log(io, socket)
    // socket.on('message', message => {
    //     console.log(message)
    // })
    const clientIdSend = (await Account.findById(newChat.idUserReceive)).clientID

    if (!clientIdSend) {
        throw new Error (`Send message to client with id ${clientIdSend}`)
    }
    //console.log(clientIdSend)

    console.log(newChat.idUserSend)

    socket.broadcast.to(clientIdSend).emit('chat:receive', {sender: newChat.idUserSend, msg: newChat.msg})
}

function sendUserList (socket, lst) {
    socket.emit('userList', lst)
}


module.exports = {
    sendMessage, disconnect, receiveMessage, updateClientID, sendUserList
}