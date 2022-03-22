import express from "express";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";
import cors from "cors";

const app = express();

// config cors

// const whitelist = [process.env.FRONTEND_URL];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       //!ok request api
//       callback(null, true);
//     } else {
//       //!no permission request api
//       callback(new Error("Error Cors"));
//     }
//   },
// };
// app.use(cors(corsOptions));

app.use(cors());

//read json
app.use(express.json());

//connect mongo
connectDB();
//routing

app.use("/api/user", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/task", taskRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`run server in port ${PORT}`);
});

