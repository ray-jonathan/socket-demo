const express = require('express');
const app = express();
const es6Renderer = require('express-es6-template-engine');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app); 


const wss = new WebSocket.Server({
  server,          // piggybacking on the plain http server
  path: '/chat'    // listen on only one route, allowing express to listen on its custom routes
});

    

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');


const msgs = [
  {"to":"ben", "from":"armond", "timestamp": "11:31am", "message":"lol cats"},
  {"to":"armond", "from":"ben", "timestamp": "11:32am", "message":"be well soon"},
];

wss.on('connection', (socket) => {
  console.log('oh boy! a new connection!');
  // socket.send(JSON.stringify(db));

  socket.on('message', (data) => {
      const parsed = JSON.parse(data)
      console.log(parsed);
      msgs.push(parsed);

      console.log(msgs);
      wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
          }
      });
      // socket.send(data);
  });
});




app.use('/chat', (req, res) => {
  res.render('index', {locals:{
    "msgs": msgs,
    // "me" : req.session.user
  }});
});

server.listen(3002, ()=> {console.log("Server is running on 3002");});