  const http = require('http');
  const express= require("express")
  const yup = require('yup');
  const mongoose = require('mongoose');
  //const app = require('./app');
  const {Schema}=mongoose;

  const tripSchema = new Schema({  
    departure: { type: String, required: true ,
    validate:{
      validator:(v)=>/[a-zA-Z\s\-]{4,25}/i.test(v),
      message:(props)=>`${props.value} is not valid city`
    }
  },
    arrival: { type: String, required: true,validate:{
      validator:(v)=>/[a-zA-Z\s\-]{4,25}/i.test(v),
      message:(props)=>`${props.value} is not valid city`
    } },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    isCorrect:{type:Boolean,default:false},
    publishAt:{type:Date,default:Date.now},
  });


  const Trip = mongoose.model('Trip', tripSchema);

  mongoose.connect(`mongodb://localhost:27017/bd_train`)
          .catch(err=>{
            console.log(err);
            process.exit(1);
          });


  const app = express();
  app.use(express.json());
  app.post('/', async (req, res, next) => {
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
      res.status(201).json({ message: 'New trip created', trip: newTrip });
    } catch (error) {
      next(error);
    }
  });
  
  
  
  const server = http.createServer(app);
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=>{
    console.log('server started at port = ' + PORT)
  })