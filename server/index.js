// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
// import bodyParser from "body-parser";
// import path from "path";


// import helmet from "helmet";
// import dbConnection from "./dbConfig/index.js";
// import errorMiddleware from "./middleware/errorMiddleware.js";
// import router from "./routes/index.js";                         

// const __dirname = path.resolve(path.dirname(""));

// dotenv.config();

// const app = express();

// app.use(express.static(path.join(__dirname, "views/build")));

// const PORT = process.env.PORT || 8800;

// dbConnection();

// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL
//       ? [process.env.CLIENT_URL, "http://localhost:3000"]
//       : ["http://localhost:3000"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   })
// );

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.use(morgan("dev"));
// app.get("/health", (req, res) => {
//   res.status(200).send("OK");
// });
// app.use(router);

// //error middleware
// app.use(errorMiddleware);

// app.listen(PORT, () => {
//   console.log(`Server running on port: ${PORT}`);
// });




import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

//securty packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

const PORT = process.env.SERVER_PORT || process.env.PORT || 8800;

const resolveOrigins = () => {
  if (process.env.CORS_ORIGIN) return process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  if (process.env.CLIENT_URL) return [process.env.CLIENT_URL];
  return ["http://localhost:3000"];
};

// DB
dbConnection();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: resolveOrigins(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

// Static files served AFTER API routes
app.use(express.static(path.join(__dirname, "views/build")));

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
