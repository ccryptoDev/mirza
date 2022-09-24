import axios from "axios";
import baseUrl from "../app.config";

// Using a function to treat the JWT as a computed property to make sure the localStorage lookup happens per request
export function getRequester() {
  const JWT = localStorage.getItem("userToken");
  if (!JWT) throw new Error("you are not authorized.");

  const token = JSON.parse(JWT);
  const Authorization = `Bearer ${token.token}`;

  return axios.create({
    baseURL: baseUrl,
    headers: { Authorization },
  });
}
