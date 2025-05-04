import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) throw new Error("No token provided");

    const { id, role } = jwt.verify(token, process.env.SECRET_JWT);
    req.userId = id;
    req.role = role;

    if (role !== "admin" && role !== "superAdmin") {
      return res.status(401).json({
        message: "You don't have permission",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or missing token",
      success: false,
    });
  }
};
