// const mongoose = require("mongoose");
const models = require("../models/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registration logic
exports.register = async (req, res) => {
  // Get user info from request body
  const { displayName, email, password } = req.body;

  const userExists = await models.User.findOne({ email });

  // Check if account with email already exists
  if (userExists) {
    return res.status(409).send("Email already in use");
  }

  try {
    // Hash user password and store user in db
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await models.User.create({
      displayName,
      email,
      password: hashedPassword,
    });

    // Create JWT and send to user in response
    const expiresIn = "14d";
    const token = jwt.sign(
      { sub: user._id, iat: Date.now() },
      process.env.JWT_HASH_PRIVATE_KEY,
      { expiresIn: expiresIn, algorithm: "RS256" }
    );

    return res.status(201).json({
      id: user._id,
      displayName: user.displayName,
      token: token,
    });
  } catch (e) {
    console.log(`Error creating new user: ${e}`);
    return res.status(500).end();
  }
};

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user account with given email exists in db
    const currentUser = await models.User.findOne({ email });

    if (currentUser) {
      const savedPassword = currentUser.password;

      // Verify given password matches the hashed password in db
      if (await bcrypt.compare(password, savedPassword)) {
        const expiresIn = "14d";
        // Create new jwt and send in response body
        const token = jwt.sign(
          { sub: currentUser._id, iat: Date.now() },
          process.env.JWT_HASH_PRIVATE_KEY,
          { expiresIn: expiresIn, algorithm: "RS256" }
        );

        return res.status(200).json({
          id: currentUser._id,
          displayName: currentUser.displayName,
          token: token,
        });
      } else {
        return res.status(401).send("Incorrect password");
      }
    } else {
      return res.status(401).send("User does not exist");
    }
  } catch (e) {
    console.log(`Error logging in user: ${e}`);
    return res.status(401).end();
  }
};
