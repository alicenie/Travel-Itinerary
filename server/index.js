const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
// const Routes = require("./routes");
const Agent = require("./agent");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/api/routes", Routes);
app.use("/api/agent", Agent);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => console.log(`🔥  server running on port ${PORT}`));
