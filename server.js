const app = require ('express')();
const http = require ('http').Server (app);
const io = require ('socket.io')(http);

let messageList = [];

app.get ('/', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next(); 
    },
    (req, res) => {
        res.send({response: messageList}).status(200);
});

io.on ('connection', (socket) => {
    console.log ('User connected');
    socket.on ('chat message', (msg, date, username) => {
        console.log("Emmiting ",msg);
        messageList.push({message: msg, time: date, user: username})
        io.emit ('chat message', {message: msg, time: date, user: username});
    });
    socket.on('user typing', (username) => {
        console.log(username," is typing");
        io.emit ('user typing', username);
    })
    socket.on ('disconnect', () => {
        console.log ('User disconnected');
    });
});

http.listen(4001, () => {
    console.log('Listening on *:4001');
});

