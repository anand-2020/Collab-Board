const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { setupSocket } = require("./setupSocket");
const userRouter = require("./routes/userRouter");

dotenv.config({ path: "./config.env" });
const app = express();

app.use(cors());
app.use(express.json());

// REACT BUILD for production
if (process.env.NODE_ENV === "PROD") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

//MONGODB connection
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully !");
});

//ROUTES
app.use("/user", userRouter);

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ...`);
});

setupSocket(server);
