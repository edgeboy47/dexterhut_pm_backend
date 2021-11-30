const models = require("../models/models");

module.exports = function authorization(options) {
  // TODO: Check user authorization after they are authenticated
  // TODO this function checks if the user has the specified role/permission to perform the request
  // TODO: function params should be permission(s) or a role
  // TODO User model should have a function to check if the user has the role or permission(s)
  return async function (req, res, next) {
    if (options.permission || options.role) {
      const user = await models.User.findById(req.user.id);
      if (user && (await user.hasAccess(options))) {
        next();
      }
      else {
        return res.status(403).json({
          error: "invalid_client",
          error_description: "User ",
        });
      }
    } else {
      return res.status(402).json({
        error: "invalid_client",
        error_description: "User is not cleared",
      });
    }
  };
};
