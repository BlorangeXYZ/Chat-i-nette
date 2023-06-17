import type { NextApiRequest, NextApiResponse } from "next";
import {
  CLIENT_SECRET,
  CLIENT_ID,
  REDIRECT_URL,
  JWT_SECRET,
} from "../utils/constants";
import { axiosApiCall } from "../utils/helpers";
import { ClientCredentials } from "simple-oauth2";
import jwt from 'jsonwebtoken'

const credentials = {
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://api.intra.42.fr",
  },
};

const oauth2 = new ClientCredentials(credentials);

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
