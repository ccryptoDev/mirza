/* eslint no-underscore-dangle:0 */
import axios from "axios";
import baseUrl from "../app.config";
import { IResponse } from "./types";
import { getRequester } from "./requester";

interface IArgyleData {
  userId: string;
  accountId: string;
}

export async function saveArgyleDataApi(body: IArgyleData) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await getRequester().post(
      `${baseUrl}/application/saveArgyleData`,
      body
    );
  } catch (error) {
    response.error = error;
  }
  return response;
}

export async function getArgyleData(body: IArgyleData) {
  let response: IResponse = { data: null, error: null };
  try {
    response = await axios.post(`${baseUrl}/application/getArgyleData`, body);
  } catch (error) {
    response.error = error;
  }
  return response;
}

export const connectArgyle = async ({
  cb,
  noEmployerHandler,
}: {
  cb?: any;
  noEmployerHandler?: any;
}) => {
  if ((global as any).Argyle) {
    const argyle = (global as any).Argyle.create({
      apiHost: "https://api-sandbox.argyle.io/v1",
      pluginKey: "017ba5ef-5218-1db8-9cd2-fb41cd455a19",
      companyName: "Mirza",
      showCloseButton: true,
      searchScreenTitle:
        "We need to verify your income by linking your employer's payroll software",
      searchScreenSubtitle: "",
      closeOnOutsideClick: false,
      cantFindLinkItemTitle: "cant find your emploeyer?",
      onAccountConnected: async (accConnectData: any) => {
        const body = {
          ...accConnectData,
        };
        cb(body);
      },
      onCantFindLinkItemClicked: () => noEmployerHandler(argyle.close),
    });
    argyle.open();
  }
};

export const argylePayrollSplit = ({
  config,
  cb,
  userId,
  employerName,
}: {
  config?: any;
  cb?: any;
  userId?: string;
  employerName?: string;
}) => {
  if ((global as any).Argyle) {
    const argyle = (global as any).Argyle.create({
      apiHost: "https://api-sandbox.argyle.io/v1",
      pluginKey: "017ba5ef-5218-1db8-9cd2-fb41cd455a19",
      companyName: "Mirza",
      userToken: config.userToken,
      introSearchPlaceholder: "Update Pay Allocation",
      searchScreenTitle: "Update Pay Allocation",
      searchScreenSubtitle: "Update Pay Allocation",
      showCategories: false,
      payDistributionItemsOnly: true,
      payDistributionUpdateFlow: true,
      payDistributionConfig: config.payDistConf,
      showCloseButton: false,
      closeOnOutsideClick: false,
      linkItems: [employerName],
      onClose: () => {
        if (cb) {
          cb({ userId });
        }
      },
    });
    argyle.open();
  }
};

export const argyleScript = () => {
  const script = document.createElement("script");
  script.src = "https://plugin.argyle.io/argyle.web.v3.js";
  script.async = true;
  document.body.appendChild(script);
};
