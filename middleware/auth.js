const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Get Token From Header
  const token = req.cookies.token;
  console.log(token);
  //check if no token
  if (!token) {
    return res.status(401).json({
      msg: "No Token!, Authorization Denied!",
    });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, "mySecret");
    req.user = decoded.user;

    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: " Token is Not Valid!" });
  }
};
