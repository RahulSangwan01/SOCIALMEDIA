import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

//securty packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";                         

const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));

const PORT = process.env.SERVER_PORT || process.env.PORT || 8800;

dbConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);

// create HTTP server and attach socket.io
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication failed"));
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.data.userId = payload.userId;
    next();
  } catch (e) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  if (userId) socket.join(userId);

  socket.on("private_message", ({ to, text }) => {
    if (!to || !text) return;
    const payload = { from: userId, to, text, ts: Date.now() };
    io.to(to).emit("private_message", payload);
    io.to(userId).emit("private_message", payload);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
