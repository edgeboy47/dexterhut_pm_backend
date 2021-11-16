const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskCommentRoutes = require("./routes/taskCommentRoutes");
const authRoutes = require("./routes/authRoutes");
const models = require("./models/models");

require("dotenv").config();

const app = express();

// Middleware Setup
app.use(express.json());
app.use(passport.initialize());

// Passport setup
passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_HASH_PUBLIC_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ["RS256"],
    },
    (payload, done) => {
      models.User.findById(payload.sub, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

// Authorization middleware
app.use("/projects", passport.authenticate("jwt", { session: false }));
app.use("/users", passport.authenticate("jwt", { session: false }));


// Running server
app.listen(process.env.PORT, () =>
  console.log(`Express server running on port ${process.env.PORT}`)
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connection established."))
  .catch((err) => console.log(`Error establishing DB connection: ${err}`));

// TODO: Enable compression of responses

// User Routes
app.use(userRoutes);

// Task Routes
app.use(taskRoutes);

// Project Routes
app.use(projectRoutes);

// TaskComment Routes
app.use(taskCommentRoutes);

// Authentication Routes
app.use(authRoutes);
