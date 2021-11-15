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
    return res.status(409).json({
      error: "invalid_request",
      error_description: "User already exists",
    });
  }

  try {
    // Hash user password and store user in db
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await models.User.create({
      displayName,
      email,
      password: hashedPassword,
    });

    // Create and send signed JWTs for access and refresh tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    return res.status(201).set("Location", `${user._id}`).json({
      id: user._id,
      displayName: user.displayName,
      access_token: accessToken,
      token_type: "Bearer",
      refresh_token: refreshToken,
    });
  } catch (e) {
    console.log(`Error creating new user: ${e}`);
    return res.status(500).json({
      error: "server_error",
      error_description: "Server Error. Please try again.",
    });
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
        // Create and send signed JWTs for access and refresh tokens
        const accessToken = createAccessToken(currentUser._id);
        const refreshToken = createRefreshToken(currentUser._id);

        return res.status(200).json({
          id: currentUser._id,
          displayName: currentUser.displayName,
          access_token: accessToken,
          token_type: "Bearer",
          refresh_token: refreshToken,
        });
      } else {
        // Incorrect password
        return res.status(401).json({
          error: "invalid_client",
          error_description: "Incorrect Password",
        });
      }
    } else {
      // User does not exist
      return res.status(401).json({
        error: "invalid_client",
        error_description: "User does not exist",
      });
    }
  } catch (e) {
    // Error with server
    console.log(`Error logging in user: ${e}`);
    return res.status(500).json({
      error: "server_error",
      error_description: "Server Error while logging in",
    });
  }
};

// TODO revoke user's access token somehow
exports.logout = async (req, res) => {};

// TODO: add function for access token refresh
exports.accessTokenRefresh = async (req, res) => {};

const createAccessToken = (userID) =>
  jwt.sign(
    {
      sub: userID,
      iat: Date.now(),
    },
    process.env.JWT_HASH_PRIVATE_KEY,
    {
      expiresIn: "1d",
      algorithm: "RS256",
    }
  );

const createRefreshToken = (userID) =>
  jwt.sign(
    {
      sub: userID,
      iat: Date.now(),
    },
    process.env.JWT_HASH_PRIVATE_KEY,
    {
      expiresIn: "14d",
      algorithm: "RS256",
    }
  );
