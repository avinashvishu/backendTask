const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
//Body Parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const Port = process.env.PORT || 8000;
//routes
const userRoute = require("./Routes/UserRoute");

//Db connection
require("./config/MongoDb");

// Health check Api
app.get("/health", (req, res) => {
    res.json({
      message: "Server is Running Fine from PaySpaze",
      status: "Active",
      time: new Date(),
    });
  });

app.use("/api/v1/auth", userRoute);

  // Listening on port
app.listen(Port, () => {
    console.log("Port is active on ", Port);
  });
  