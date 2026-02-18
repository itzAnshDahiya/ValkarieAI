import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_PASSWORD;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default {
  JWT_USER_PASSWORD,
  GEMINI_API_KEY,
};
