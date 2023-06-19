import Mongoose from "mongoose";

const localDB = `mongodb://localhost:27017/trading-journal`;

const connectDB = async () => {
    await Mongoose.connect(localDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");
};

export default connectDB;
