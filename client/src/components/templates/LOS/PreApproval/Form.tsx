import React, { useEffect, useState } from "react";
import { ErrorAlert } from "../../../molecules/ErrorMessage/FormError";
import {
  getArgyleData,
  connectArgyle,
  argyleScript,
} from "../../../../api/argyle";

import PreApproval from "./PreApproval";
import Approval from "./Approval";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvalData, setApprovalData] = useState<any>(null);

  const triggerGetArgyleData = (argylePayload: any) => {
    setLoading(true);
    // GIVE 5 SECONDS TO ARGYLE TO SAVE DATA (BUG FIX)
    setTimeout(async () => {
      //   FETCH USER DATA
      setApprovalData({ approvedAmount: 123000 });

      // const argyleData = await getArgyleData(argylePayload);
      // if (argyleData && argyleData.data && !argyleData.error) {
      //   getArgyleFormData({ userData: argyleData.data, argylePayload });
      //   setApprovalData({ approvedAmount: 123000 });
      // } else if (argyleData.error) {
      //   const message =
      //     argyleData?.error?.message || "something went wrong, try again!";
      //   setError(message);
      // }
      setLoading(false);
    }, 5000);
  };

  // OPEN ARGYLE MODAL
  const openArgyle = async () => {
    // CONNECT ARGYLE ACCOUNG AND GET FIELDS FOR FETCHING USER DATA
    await connectArgyle({ cb: triggerGetArgyleData });
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
