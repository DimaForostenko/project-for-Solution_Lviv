  const http = require('http');
  const yup = require('yup');
  const mongoose = require('mongoose');
  const app = require('./app');
  const {Schema}=mongoose;

  const citySchema = yup.string().matches(/^([A-Z][a-z]+(\s|\-)?)+$/).required('Not correct city')

  const tripSchema = new Schema({  
    departure: { type: String, required: true ,
    validate:{
      validator:(v)=>citySchema.isValidSync(v),
      message:(props)=>`${props.value} is not valid city`
    }
  },
    arrival: { type: String, required: true,validate:{
      validator:(v)=>citySchema.isValidSync(v),
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
  
  const server = http.createServer(app);
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, ()=>{
    console.log('server started at port = ' + PORT)
  })