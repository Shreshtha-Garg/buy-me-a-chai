import mongoose from 'mongoose';

const connectDB = async () => {
  // console.log("Inside connectDB function");

  if (mongoose.connections[0].readyState) {
    // console.log("Already connected to the database");
    // console.log(mongoose.connections[0].host);
    return;
  }

  try {
    // console.log("Trying to connect to the database");
    await mongoose.connect(process.env.MONGODB_URI);
    // console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;


// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if(!MONGODB_URI){
//     throw new Error(
//         'Please define Mongo DB URI'
//     )
// }

// let cached = global.mongoose

// if(!cached){
//     cached = global.mongoose = {conn: null, promise: null}
// }
// console.log("Outside connectDB function");
// async function connectDB() {
//   console.log("Inside connectDB function");
//     if (cached.conn) {
//       console.log("Already connected to the database");
//       console.log(cached.conn);
//       return cached.conn
//     }
  
//     if (!cached.promise) {
//       console.log("No connection to the database");
//       const opts = {
//         bufferCommands: false,
//       }
//       console.log("before connecting to the database");
//       cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//         console.log(`MongoDB Connected: ${mongoose.connection.host}`);
//         return mongoose
//       })
//     }
  
//     try {
//       cached.conn = await cached.promise
//     } catch (e) {
//       cached.promise = null
//       console.log("Error connecting to the database");
//       throw e
//     }
  
//     return cached.conn
//   }

//   export default connectDB;
