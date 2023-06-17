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
  if (req.method === "POST") {
    try {
      const token = req.body.data
      if (token) {
        jwt.verify(token, JWT_SECRET, (error: any) => {
          if (error) {
            return res.status(200).json({ error: "token forbidden" });
          }
          return res.status(200).json({ message: "token authenticated" });
        });
      } else {
        res.status(401);
      }
    } catch (err) {
      console.error("error: ", err);
    }
  }
}
