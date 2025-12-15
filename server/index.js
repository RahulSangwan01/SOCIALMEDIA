import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { Server as IOServer } from "socket.io";
import JWT from "jsonwebtoken";

//securty packges
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";
import Message from "./models/messageModel.js";
import Conversation from "./models/conversationModel.js";

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

// HTTP + Socket.IO server
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*" },
});

const onlineUsers = new Map(); // userId -> Set of socketIds

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Unauthorized"));
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = payload.userId;
    next();
  } catch (e) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const uid = String(socket.userId);
  const set = onlineUsers.get(uid) || new Set();
  set.add(socket.id);
  onlineUsers.set(uid, set);

  socket.on("send_message", async ({ to, content }) => {
    try {
      if (!to || !content) return;
      let convo = await Conversation.findOne({ participants: { $all: [uid, to] } });
      if (!convo) {
        convo = await Conversation.create({ participants: [uid, to] });
      }
      const msg = await Message.create({ conversation: convo._id, from: uid, to, content });
      await Conversation.findByIdAndUpdate(convo._id, { lastMessage: content });

      const payload = { _id: msg._id, conversation: String(convo._id), from: uid, to, content, createdAt: msg.createdAt };

      // emit to sender (echo)
      socket.emit("receive_message", payload);

      // emit to receiver if online
      const targetSockets = onlineUsers.get(String(to));
      if (targetSockets) {
        for (const sid of targetSockets) {
          io.to(sid).emit("receive_message", payload);
        }
      }
    } catch (e) {
      // swallow
    }
  });

  socket.on("disconnect", () => {
    const s = onlineUsers.get(uid);
    if (s) {
      s.delete(socket.id);
      if (s.size === 0) onlineUsers.delete(uid);
      else onlineUsers.set(uid, s);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
