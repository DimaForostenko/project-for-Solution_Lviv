const Trip = require("../models/Trip");


module.exports.createTrip = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate input using yup schema
    const schema = yup.object().shape({
      departure: yup.string().required(),
      arrival: yup.string().required(),
      departureTime: yup.date().required(),
      arrivalTime: yup.date().required(),
    });

    await schema.validate({ departure, arrival, departureTime, arrivalTime });

    // Create a new trip object based on the input
    const newTrip = new Trip({ body });

    // Save the new trip to the database
    await newTrip.save();

    // Send a success response
    res.status(201).json({ message: "New trip created", trip: newTrip });
  } catch (error) {
    next(error);
  }};

  module.exports.getAllTrip =  async (req, res, next) => {
    try {
      const trips = await Trip.find();
      res.status(200).send({data:trips});
    } catch (error) {
      next(error);
    }
  };

  module.exports.updateTrip = async (req, res, next) => {
    try {
      const {  } = body;
  
      // Validate input using yup schema
      const schema = yup.object().shape({
        departure: yup.string(),
        arrival: yup.string(),
        departureTime: yup.date(),
        arrivalTime: yup.date(),
      });
  
      await schema.validate({ departure, arrival, departureTime, arrivalTime });
  
      // Find the trip in the database and update its properties
      const {body,params:{tripId}}=req; 
      const trip=await Trip.findByIdAndUpdate(tripId,body,{ new: true });
      if (!tripId) {
        return res.status(404).json({ message: "Trip not found" });
      }
  
      // Send a success response
      res.status(200).send(trip );
    } catch (error) {
      next(error);
    }
  };

  module.exports.deleteTrip = async (req, res, next) => {
    try {
      console.log(req.params.id)
      // Find the trip in the database and delete it
      const trip = await Trip.findByIdAndDelete({"_id":req.params.id,});
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      // Send a success response
      res.json({success:true} );
    } catch (error) {
      next(error);
    }
  };