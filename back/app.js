const express = require("express");
const cors = require("cors")
const TripControllers = require("./controllers/trip.controller")

const app = express();
app.use(cors())
app.use(express.json());

// Create a new trip
app.post("/", TripControllers.createTrip);

// Get all trips
app.get("/", TripControllers.getAllTrip);

// Update a trip
app.put("/:id", TripControllers.updateTrip);

// Delete a trip
app.delete("/:id", TripControllers.deleteTrip);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;