import mongoose from "mongoose";

const connectDB = async()=>{
   try {
       const connect = await mongoose.connect(process.env.MONGODB_URL)
       if(connect){
        console.log("mongodb connected")
       }
   } catch (error) {
       console.log(error)
   }
}

export default connectDB