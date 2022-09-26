import axios from "axios";
import { getRequester } from "./requester";
import baseUrl from "../app.config";

export type IResponse = {
  data: any;
  error: null | {
    message: string;
  };
};

// Gets the User info
// THIS IS AN EXAMPLE OF AN AUTHORIZED REQUEST
export async function getUserInfo() {
  let response: any = { data: null, error: null };
  try {
    response = await getRequester().get(`${baseUrl}/ApiGetUserInfo`);
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function fetchContractApi({
  screenTrackingId,
}: {
  screenTrackingId: string;
}) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await getRequester().get(
      `${baseUrl}/api/application/contract `,
      {
        params: {
          screenTrackingId,
        },
      }
    );
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function finalizeContractApi({
  screenTrackingId,
  userId,
}: {
  screenTrackingId: string;
  userId: string;
}) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await getRequester().post(
      `${baseUrl}/api/application/finalize  `,
      {
        screenTrackingId,
        userId,
      }
    );
  } catch (error) {
    response.error = error;
  }
  return response;
}
