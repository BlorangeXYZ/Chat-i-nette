import type { NextApiRequest, NextApiResponse } from "next";
import {
  CLIENT_SECRET,
  CLIENT_ID,
  REDIRECT_URL,
  JWT_SECRET,
} from "../utils/constants";
import { axiosApiCall } from "../utils/helpers";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code`;
    return res.status(200).json({ redirectUrl: url });
  }
  if (req.method === "POST") {
    try {
      const response = await axiosApiCall(
        "/oauth/token",
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: req.body.data,
          grant_type: "client_credentials",
        },
        "POST"
      );

      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Generate a JWT token
      const token = jwt.sign({ data: response.data }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json(token);
    } catch (err) {
      console.error("error: ", err);
    }
  }
}
