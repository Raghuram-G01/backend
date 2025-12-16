const express = require("express");
const cors = require("cors");
const database = require("./db-connect/db");
const BasicRoutes = require("./routes/basic-routes");
const AdminRoutes = require("./routes/admin-routes");
let port = 21000;
const app = express();
database.connect(); //
app.use(
  cors({
    origin: [
      "http://51.20.66.94:5173", // Your EC2 frontend
      "http://localhost:5173", // Local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 👈 Add this if you're using cookies/sessions
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/v1/User", BasicRoutes);
app.use("/api/v1/Admin", AdminRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Port is running",
  });
});

app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
