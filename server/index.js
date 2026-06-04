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
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

const PORT = process.env.SERVER_PORT || process.env.PORT || 8800;

const resolveOrigins = () => {
  if (process.env.CORS_ORIGIN)
    return process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  if (process.env.CLIENT_URL) return [process.env.CLIENT_URL];
  return ["http://localhost:3000"];
};

const corsOptions = {
  origin: resolveOrigins(),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// DB
dbConnection();

// 1. CORS must be first — before helmet and everything else
app.use(cors(corsOptions));

// 2. Handle preflight requests for all routes explicitly
app.options("*", cors(corsOptions));

// 3. Helmet after cors
app.use(helmet());

// 4. Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 5. Logger
app.use(morgan("dev"));

// 6. Routes
app.use(router);

// 7. Static files
app.use(express.static(path.join(__dirname, "views/build")));

// 8. Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 9. Error middleware last
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(`Allowed origins: ${resolveOrigins().join(", ")}`);
});