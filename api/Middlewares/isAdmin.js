import jwt from "jsonwebtoken";
import { HandleERROR } from "vanta-api";

export const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HandleERROR("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    if (decoded.role !== "admin") {
      return next(new HandleERROR("Access denied: Admins only", 403));
    }

    // Optional: attach user info to request
    req.user = decoded;

    next(); // ✅ user is admin
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return next(new HandleERROR("Invalid token", 401));
  }
};
