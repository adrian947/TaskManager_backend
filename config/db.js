import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`Mongo DB Connect: ${url}`);
  } catch (error) {
    console.log("error: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
