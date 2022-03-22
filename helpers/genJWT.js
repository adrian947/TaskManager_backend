import jwt from "jsonwebtoken";

const genJWT = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );
};

export default genJWT;
