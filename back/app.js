const express = require("express");
const yup = require("yup");
const Trip = require("./models/Trip");

const app = express();
app.use(express.json());

// Create a new trip
app.post("/", async (req, res, next) => {
  try {
    const { departure, arrival, departureTime, arrivalTime } = req.body;

    // Validate input using yup schema
    const schema = yup.object().shape({
      departure: yup.string().required(),
      arrival: yup.string().required(),
      departureTime: yup.date().required(),
      arrivalTime: yup.date().required(),
    });

    await schema.validate({ departure, arrival, departureTime, arrivalTime });

    // Create a new trip object based on the input
    const newTrip = new Trip({ departure, arrival, departureTime, arrivalTime });

    // Save the new trip to the database
    await newTrip.save();

    // Send a success response
    res.status(201).json({ message: "New trip created", trip: newTrip });
  } catch (error) {
    next(error);
  }
});

// Get all trips
app.get("/", async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    next(error);
  }
});

// Update a trip
app.put("/:id", async (req, res, next) => {
  try {
    const { departure, arrival, departureTime, arrivalTime } = req.body;

    // Validate input using yup schema
    const schema = yup.object().shape({
      departure: yup.string(),
      arrival: yup.string(),
      departureTime: yup.date(),
      arrivalTime: yup.date(),
    });

    await schema.validate({ departure, arrival, departureTime, arrivalTime });

    // Find the trip in the database and update its properties
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { departure, arrival, departureTime, arrivalTime },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Send a success response
    res.json({ message: "Trip updated", trip });
  } catch (error) {
    next(error);
  }
});

// Delete a trip
app.delete("/:id", async (req, res, next) => {
  try {
    // Find the trip in the database and delete it
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Send a success response
    res.json({ message: "Trip deleted", trip });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;