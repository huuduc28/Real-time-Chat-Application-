const express = require('express')
const env = require('dotenv')
const path = require('path')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const route = require('./routes')
const socketio = require('socket.io')
const passport = require('passport');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const db = require('./config/database')
const { createServer } = require('http')

const flash = require('express-flash')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('chat'))
// app.use(session({ cookie: { maxAge: null } }))
const sessionMiddleware = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
})

app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session())
app.use(flash())


app.engine('hbs',
    handlebars.engine({
        extname: 'hbs', //Set extenstion name is hbs
        defaultLayout: 'main',
    })
)

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

env.config() //Config env
db.connect()
app.use('/', route)

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

const httpServer = createServer(app)

const io = socketio(httpServer)

io.engine.use(session({ cookie: { maxAge: null } }))

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))

const { sendMessage, disconnect, receiveMessage, updateClientID, sendUserList } = require('./controllers/ChatController')

let userList = []

io.of('/').on('connection', socket => {
    try {
        updateClientID(io, socket)

        console.log(`Client connected with ID ${socket.id}`)

        let client

        if (socket.request.session.user) {
            client = {
                clientId: socket.id,
                username: socket.request.session.user.fullName,
                idUserDB: socket.request.session.user._id,
                avatar: socket.request.session.user.avatar
            }
        }

        sendUserList(socket, userList)
        socket.broadcast.emit('newUser', client)

        userList.push(client)
        console.log(userList)

        //sendMessage(io, socket)
        receiveMessage(io, socket)
        disconnect(userList, io, socket)
    }
    catch (err) {
        console.log(err.message)
    }
})

httpServer.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})