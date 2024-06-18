import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Mongo Db connected successfully ${mongoose.connection.host}`.bgMagenta
    );
  } catch (error) {
    console.log(`Error to connect mongo db ${error}`.bgRed.white);
  }
};

export default connectDB;
