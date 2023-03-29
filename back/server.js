const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const SocketServer = require("socket.io");
const Trip = require('./models/Trip');
const { SOCKET_EVENT } = require('./configs');

mongoose.connect(`mongodb://localhost:27017/bd_train`)
          .catch(err=>{
            console.log(err);
            process.exit(1);
          });
          
const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=>{
  console.log('server started at port = ' + PORT)
  })
  const server = http.createServer(app);
  const io = SocketServer(server);

  io.on('connection',(socket)=>{
  console.log("socket connect -",socket);
  socket.on(SOCKET_EVENT.NEW_TRIP,async(newTrip)=>{
    console.log(newTrip);
    const saveTrip = await Trip.create(newTrip);
    socket.emit(SOCKET_EVENT.NEW_TRIP,saveTrip);
  }) 
  socket.on("disconnect",(reason)=>{
    console.log("socket disconnect - reason - ",reason);
  })
  });

