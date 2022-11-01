import React, { useEffect, useState } from "react";
import { ErrorAlert } from "../../../molecules/ErrorMessage/FormError";
import {
  connectArgyle,
  argyleScript,
  saveArgyleDataApi,
} from "../../../../api/argyle";

import PreApproval from "./PreApproval";
import Approval from "./Approval";
import { useUserData } from "../../../../contexts/user";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvalData, setApprovalData] = useState<any>(null);
  const { screenId, user } = useUserData();
  const employerId = user?.data?.merchant?.argyleLinkItemId;
  console.log(employerId);
  const triggerGetArgyleData = (argylePayload: any) => {
    setLoading(true);
    // GIVE 5 SECONDS TO ARGYLE TO SAVE DATA (BUG FIX)
    setTimeout(async () => {
      //   FETCH USER DATA
      setApprovalData({ approvedAmount: 123000 });
      const { argyleLinkItemId } = user?.data?.merchant;
      const payload = {
        argyleUserId: argylePayload?.userId,
        argyleAccountId: argylePayload?.accountId,
        argyleLinkItemId,
        screenId,
      };
      const result = await saveArgyleDataApi(payload);
      setLoading(false);
    }, 5000);
  };

  // OPEN ARGYLE MODAL
  const openArgyle = async () => {
    // CONNECT ARGYLE ACCOUNG AND GET FIELDS FOR FETCHING USER DATA
    await connectArgyle({ cb: triggerGetArgyleData, employerId });
  };

  useEffect(() => {
    argyleScript();
  }, []);

  return (
    <div>
      <ErrorAlert message={error} setMessage={setError} />
      {approvalData ? (
        <Approval data={approvalData} />
      ) : (
        <PreApproval openArgyle={openArgyle} loading={loading} />
      )}
    </div>
  );
};

export default Form;
