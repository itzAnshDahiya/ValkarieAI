import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }
    
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ 
      error: "Invalid token or expired",
      details: error.message
    });
  }
}

export default userMiddleware;
