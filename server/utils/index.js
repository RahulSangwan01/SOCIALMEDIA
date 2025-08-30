import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};

export const compareString = async (plain, hashedOrPlainFromDb) => {
  try {
    const isMatch = await bcrypt.compare(plain, hashedOrPlainFromDb);
    if (isMatch) return true;
  } catch (e) {
    // fall through
  }
  if (process.env.ALLOW_PLAINTEXT_PASSWORDS === "true") {
    return plain === hashedOrPlainFromDb;
  }
  return false;
};

// JSON WEBTOKEN
export function createJWT(id) {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
}
