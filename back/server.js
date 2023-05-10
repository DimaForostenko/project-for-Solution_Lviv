const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const SocketServer = require("socket.io");
const Trip = require('./models/Trip');
const { SOCKET_EVENT } = require('./configs');

mongoose.connect(`mongodb://localhost:27017/bd_train`);
          
          
          
const PORT = process.env.PORT || 5000;
 
  const server = http.createServer(app);
  const cors =    {
    origin: "http://localhost:3000"
  }
  const io = SocketServer(server,{cors});

  io.on('connection',(socket)=>{
  console.log("socket connect -",);
  socket.on(SOCKET_EVENT.NEW_TRIP,async(newTrip)=>{
    try{
    console.log(newTrip);
    const saveTrip = await Trip.create(newTrip);
    io.emit(SOCKET_EVENT.NEW_TRIP,saveTrip);
  }catch(error){
    socket.emit(SOCKET_EVENT.NEW_TRIP_ERROR,error)
    }});
    // Socket event listener for updating a trip
socket.on(SOCKET_EVENT.UPDATE_TRIP, async (updatedTrip) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      updatedTrip._id,
      updatedTrip,
      { new: true }
    );

    if (!trip) {
      return socket.emit(SOCKET_EVENT.UPDATE_TRIP_ERROR, { message: "Trip not found" });
    }

    // Emit an event to all connected clients with the updated trip data
    io.emit(SOCKET_EVENT.UPDATE_TRIP, trip);
  } catch (error) {
    socket.emit(SOCKET_EVENT.UPDATE_TRIP_ERROR, error);
  }
});
// Socket event listener for deleting a trip
socket.on(SOCKET_EVENT.DELETE_TRIP, async (tripId) => {
  try {
    console.log(tripId)
    const trip = await Trip.findByIdAndDelete(tripId);

    if (!trip) {
      return socket.emit(SOCKET_EVENT.DELETE_TRIP_ERROR, { message: "Trip not found" });
    }
    // Emit an event to all connected clients with the deleted trip data
    io.emit(SOCKET_EVENT.DELETE_TRIP, trip);
  } catch (error) {
    socket.emit(SOCKET_EVENT.DELETE_TRIP_ERROR, error);
  }
});
  socket.on("disconnect",(reason)=>{
    console.log("socket disconnect - reason - ",reason);
  })
  });
  server.listen(PORT, ()=>{
    console.log('server started at port = ' + PORT)
    });
