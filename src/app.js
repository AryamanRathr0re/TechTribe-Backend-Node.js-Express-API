const express = require("express");
const cors = require("cors");
const { AuthAdmin } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const cookieparser = require("cookie-parser");
const http = require("http");
require("dotenv").config();

// Allow trusted proxies (e.g., Render) so secure cookies aren't stripped
app.set("trust proxy", 1);

// CORS: allow localhost and deployed frontend by default, overrideable via CORS_ORIGIN
const defaultOrigins = [
  "http://localhost:5173",
  "https://techtribe-web.onrender.com",
];
const allowedOrigins = (process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : defaultOrigins
).map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profileRouter.js");
const connectionRequest = require("./routes/connectionRequest.js");
const userRouter = require("./routes/user.js");
const initialiseSocket = require("./utils/soket.js");
const chatRouter = require("./routes/chat.js");

// Mount available routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequest);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initialiseSocket(server);

connectDB()
  .then(() => {
    console.log("Connection established Successfully");

    server.listen(process.env.PORT, () => {
      console.log("the server is running");
    });
  })
  .catch((err) => {
    console.error("Error in connection");
  });
