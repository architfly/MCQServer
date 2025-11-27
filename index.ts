// import cluster, { Worker } from "cluster";
// import os from "os";
// import express, { Request, Response } from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import { connectDb } from "./Config/DBconnect";
// import router from "./Route/index";
// import { connectRedis } from "./Config/RedisConnet";

// dotenv.config();

// const numCPUs = os.cpus().length; // Get CPU cores count

// if (cluster.isPrimary) {
//   console.log(`Master process ${process.pid} is running`);
//   console.log("CPU count:", numCPUs);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Restart workers if they die
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
//   const app = express();
//   const PORT = Number(process.env.PORT) || 9001;

//   connectDb();

  
//   // Connect Redis
//   connectRedis()
//     .then(() => console.log(`Worker ${process.pid} connected to Redis`))
//     .catch((err) => console.error("Redis connection failed", err));
//   // Middleware
//   app.use(express.json({ limit: "20mb" }));
//   app.use(cors({ origin: "*" }));
//   app.use(bodyParser.json());

//   // Routes
//   app.use("/api", router);

//   // Example test route
//   // app.post("/api/user/signin", async (req: Request, res: Response) => {
//   //   console.log("Request body:", req.body);
//   //   return res.status(200).json({
//   //     message: "Signed in successfully",
//   //   });
//   // });

//   // Start server
//   app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Worker ${process.pid} running at http://localhost:${PORT}`);
//   });
// }

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDb } from "./Config/DBconnect";
import router from "./Route/index";
import { connectRedis } from "./Config/RedisConnet";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 9001;

// Connect MongoDB
connectDb();

// Connect Redis
connectRedis()
  .then(() => console.log(`Connected to Redis`))
  .catch((err) => console.error("Redis connection failed", err));

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Routes
app.use("/api", router);

// Example test route (optional)
// app.post("/api/user/signin", async (req, res) => {
//   console.log("Request body:", req.body);
//   return res.status(200).json({ message: "Signed in successfully" });
// });

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
