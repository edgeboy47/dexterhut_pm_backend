require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [];

// get users
app.get("/users", (req, res) => {
  res.json(users);
});

// add user
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const accessToken = jwt.sign(
      req.body.email,
      process.env.ACCESS_SECRET_TOKEN
    );
    res.json({ accessToken: accessToken });
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      accessToken: accessToken,
    };
    users.push(user);
    res.status(201).send("User created succesfully");
  } catch {
    res.status(500).send("Error creating user");
  }
});

// login
app.post("/users/login", async (req, res) => {
  // Authenticate user
  const user = users.find((user) => user.email === req.body.email);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Succes");
    } else {
      res.send("Wrong user or password ");
    }
  } catch {
    res.status(500).send("Error");
  }
});

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

app.listen(process.env.PORT, () =>
  console.log(`Express server running on port ${process.env.PORT}`)
);
