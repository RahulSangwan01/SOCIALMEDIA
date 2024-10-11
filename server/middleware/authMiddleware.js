import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT using the secret key
    const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the user information to the request body
    req.body.user = {
      userId: userToken.userId,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default userAuth;
