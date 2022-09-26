/* eslint no-underscore-dangle:0 */
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import PromissoryNote from "./Content";
import SignaturePad from "./SignaturePad";
import Loader from "../../../../molecules/Loaders/LoaderWrapper";
import { mockRequest } from "../../../../../utils/mockRequest";
import { Button } from "../../../../atoms/Buttons/Regular";

const Styles = styled.div`
  width: 100%;
  border: 1px solid var(--color-grey-light);
  border-radius: 14px;
  background: #fff;
  .note {
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 12px;
  }

  .img-wrapper {
    margin-right: 40px;
  }

  @media screen and (max-width: 1024px) {
    padding: 12px;
  }

  @media screen and (max-width: 900px) {
    padding: 6px;
  }

  @media print {
    .contract-container {
      height: 11in;
      width: 8.5in;
    }

    body {
      font-size: 10pt;
    }
    .no-break {
      page-break-inside: avoid;
    }
  }

  @page {
    margin: 20mm 10mm;
  }
`;

const Form = styled.form`
  .heading {
    margin-bottom: 20px;
  }

  .form-layout {
    margin-bottom: 20px;
  }

  button {
    &:hover {
      box-shadow: none;
    }
  }
`;

const ExpandWrapper = styled.div`
  height: 500px;
  transition: all 0.3s;
  overflow: hidden;
  position: relative;
  &.expanded {
    height: auto;
  }

  .expand-button {
    background: #fff;
  }

  .expand-button-wrapper {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #ffffff 100%
    );
    position: absolute;
    top: 100%;
    transform: translateY(-100%);
    height: 100%;
    width: 100%;
    padding: 7px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
`;

const Contract = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const sigCanvas = useRef<any>({});
  const [loading, setLoading] = useState(false);
  const textContent = useRef<any>();
  const [expanded, setExpanded] = useState(false);

  // const fetchRic = async () => {
  //   const userSignature = user?.data?.doc?.signature;
  //   if (screenTrackingId) {
  //     const result = await fetchContractApi(screenTrackingId);
  //     if (result && result?.data && !result.error) {
  //       setRicData(result.data);
  //       setSignature(userSignature);
  //     } else if (result?.error) {
  //       const { message } = result?.error;
  //       setError(message);
  //     }
  //   }
  // };

  const save = async () => {
    if (!sigCanvas.current.isEmpty()) {
      setLoading(true);
      await mockRequest();
      const sigURI = sigCanvas.current.getTrimmedCanvas().toDataURL();
      setSignature(sigURI);
      // const payload = {
      //   userId: user?.data?.id,
      //   data: sigURI.replace(",", "removeit").split("removeit")[1],
      // };
      // await saveSignature(payload);
      // await fetchUser();
      toast.success("signature has been saved");
      setLoading(false);
    }
  };

  return (
    <Styles>
      <Form>
        <div className="form-layout">
          <Loader loading={loading}>
            {!signature && <SignaturePad sigCanvas={sigCanvas} save={save} />}
          </Loader>
          <ExpandWrapper className={`${expanded ? "expanded" : ""}`}>
            <div ref={textContent} className="contract-container">
              <PromissoryNote signature={signature} />
            </div>
            {!expanded && (
              <div className="expand-button-wrapper">
                <Button
                  type="button"
                  className="expand-button outlined"
                  onClick={() => setExpanded(true)}
                >
                  Read all and sign
                </Button>
              </div>
            )}
          </ExpandWrapper>
        </div>
      </Form>
    </Styles>
  );
};

export default Contract;
