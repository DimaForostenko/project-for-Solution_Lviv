const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost:27017/bd_train`)
.catch(err=>{
  console.log(err);
  process.exit(1);
});