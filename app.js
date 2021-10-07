const express = require("express");
require("dotenv").config();

const app = express();
app.listen(process.env.PORT, () =>
  console.log(`Express server running on port ${process.env.PORT}`)
);
