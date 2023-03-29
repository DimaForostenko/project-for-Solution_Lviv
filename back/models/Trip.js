const mongoose = require('mongoose');
const yup = require("yup");
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

module.exports = Trip;