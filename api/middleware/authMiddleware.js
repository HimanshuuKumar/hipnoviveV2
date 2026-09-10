import jwt from "jsonwebtoken";
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("authorization");
    if (!authHeader) {
      return res.statys(401).json({ message: "authentication required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
