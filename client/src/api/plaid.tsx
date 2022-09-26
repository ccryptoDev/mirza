import axios from "axios";
import { getRequester } from "./requester";
import baseUrl from "../app.config";

export type IResponse = {
  data: any;
  error: null | {
    message: string;
  };
};

export async function loginToPlain(publicToken: string) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await getRequester().post(`${baseUrl}/api/plaid/loginToPlaid`, {
      public_token: publicToken,
    });
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function getLinkToken() {
  let response: IResponse = { data: null, error: null };
  try {
    response = await axios.post(`${baseUrl}/api/plaid/createLinkToken`);
  } catch (error) {
    response.error = error;
  }
  return response.data;
}
