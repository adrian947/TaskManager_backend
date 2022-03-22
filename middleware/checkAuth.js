import jwt from "jsonwebtoken";
import User from "./../models/user.js";

//! check if comes a token for headers
const checkAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id).select(
        "-password -confirmed -createdAt -token -updatedAt -__v"
      );

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "Invalid token not sent" });
  }

  next();
};

export default checkAuth;
