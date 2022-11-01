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
export async function getApplicationInfo(id: string) {
  let response: any = { data: null, error: null };
  try {
    response = await axios.get(`${baseUrl}/application/${id}`);
  } catch (error) {
    response.error = error;
  }
  return response;
}

interface IUpdateApplication {
  requestedAmount?: number;
  annualIncome?: number;
  currentScreen: string;
  screenId: string;
}

export async function updateApplicationInfo(body: IUpdateApplication) {
  let response: any = { data: null, error: null };
  const { screenId } = body;
  try {
    response = await axios.patch(`${baseUrl}/application/${screenId}`, body);
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function reviewOfferApi(screenId: string) {
  let response: any = { data: null, error: null };
  try {
    response = await axios.get(`${baseUrl}/aplication_flow/review_offer/1`);
  } catch (error) {
    response.error = error;
  }
  return response;
}

interface ISaveSignature {
  screenTrackingId: string;
  imgBase64: string;
}

export async function saveSignatureApi(body: ISaveSignature) {
  let response: any = { data: null, error: null };
  const { screenTrackingId, imgBase64 } = body;
  try {
    response = await axios.post(`${baseUrl}/application/esignature`, {
      imgBase64,
      screenTrackingId,
    });
  } catch (error) {
    response.error = error;
  }
  return response;
}

// -----------------------------------------

export async function fetchContractApi(screenTrackingId: string) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await axios.get(`${baseUrl}/application/contract`);
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function finalizeContractApi(screenTrackingId: string) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await getRequester().post(`${baseUrl}/application/consents  `);
  } catch (error) {
    response.error = error;
  }
  return response;
}
