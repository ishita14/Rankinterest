const jwt = require("jsonwebtoken");

const { badRequestError } = require("../../global_functions");

function VerifyUserJWT(req, res, next) {

  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in " })
  }
  const token = authorization.replace("Bearer ", "")
  if (token == null) return res.status(401).send("empty token");
  jwt.verify(token, "secret123", (error, users) => {
    if (error) {
      return badRequestError(res, "authorization token expired or wrong");
    }

    req.user = users;
    //console.log("user details//"+users.userId)


    next();
  });
};

module.exports = {
  VerifyUserJWT
}
