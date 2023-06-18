import axios from "axios";
import { CLIENT_ID, CLIENT_SECRET, API_42 } from "./constants";

export const getBearerToken = (CLIENT_ID: string, KEY: string) => {
    return Buffer.from(`${CLIENT_ID}:${KEY}`).toString("base64");
};

export const axiosApiCall = async (url: string, data: {}, method: string) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Credentials is not defined");
  }
  const encodedCredentials = getBearerToken(CLIENT_ID, CLIENT_SECRET);

  const config = {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  };

  if (method === 'POST') {
    return await axios.post(API_42 + url, data, config);
  } else if (method === 'GET') {
    return await axios.get(API_42 + url, config);
  } else {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
};