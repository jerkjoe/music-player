const express = require('express')
const userRouter = require('./user')
// const registerRouter = require('./register')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const model = require('./model')
const Chat = model.getModel('chat')

// work with express
const server = require('http').Server(app)
// socket.io
const io = require('socket.io')(server)

//  Cross Origin
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' 3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})


io.on('connection', function(socket){
    console.log('User Login')
    socket.on('sendmsg', function(data) {
        // console.log(data)
        // io.emit('recvMsg', data)

        const {from, to, msg} = data
        const chatid = [from, to].sort().join('_')
        Chat.create({chatid, from, to, content: msg, create_time: new Date().getTime()}, function(err, doc) {
            io.emit('recvmsg', Object.assign({}, doc._doc))
        })

    })
})

app.use(cookieParser())
app.use(bodyParser.json())

app.use('/user', userRouter)

app.get('/', function(req, res) {
    res.send('<h1>Hello!</h1>')
})

server.listen(9093, function() {
    console.log('Node app start at port 9093...')
})

