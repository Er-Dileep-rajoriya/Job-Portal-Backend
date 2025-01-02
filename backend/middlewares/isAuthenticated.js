import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication failed.",
        success: false,
      });
    }

    const decrypt = jwt.verify(token, process.env.SECRET_KEY);

    if (!decrypt) {
      return res.status(401).json({
        message: "Authentication failed.",
        success: false,
      });
    }

    req.userId = decrypt.userId;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export default isAuthenticated;
