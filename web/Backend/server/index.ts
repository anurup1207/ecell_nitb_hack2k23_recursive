import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
const app = express();
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

// Socket.io
const http = createServer(app);
export const io = new Server(http, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  },
});
import { SocketServer } from "./config/socket";

io.on("connection", (socket: Socket) => {
  SocketServer(socket);
});

// Routes
app.use("/api", routes);

// Database
import "./config/database";

// server listenning
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
