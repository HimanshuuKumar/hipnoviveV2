import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./Routes/userRoute.js";
import videoRoute from "./Routes/videoRoute.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, { dbName: "Social_M_Video" })
  .then(() => console.log("mongodb connected successfully"))
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRoute);
app.use("/video", videoRoute);
const port = 4000;

app.listen(port, () => console.log(`server is rounning on port ${port}`));
