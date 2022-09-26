import React from "react";
import styled from "styled-components";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "../../../../atoms/Buttons/Regular";
import { TextS as Note, H4 as Heading } from "../../../../atoms/Typography";

type IProps = {
  sigCanvas: any;
  save: any;
};

const Wrapper = styled.div`
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin: 24px 0;
  & h2 {
    font-weight: 700;
  }

  & .note {
    margin: 12px 0;
  }

  .btn-secondary {
    background: transparent;
  }

  .sigcanvas {
    border: 1px solid var(--color-border);
    background: #fff;
    border-radius: 8px;
    margin: 10px 0;
    height: 100px;
    width: 100%;
  }

  .buttons-wrapper {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  @media screen and (max-width: 767px) {
    padding: 12px;
  }
`;

function SignaturePad({ sigCanvas, save }: IProps) {
  const clear = () => sigCanvas.current.clear();
  return (
    <Wrapper>
      <Heading>Add your signature</Heading>
      <Note className="note color-text">
        Please click and hold your mouse to sign your signature in the box
        below. You will need to sign the fields below with your signature.
      </Note>
      <SignatureCanvas
        ref={sigCanvas}
        canvasProps={{
          className: "sigcanvas",
        }}
      />
      <div className="buttons-wrapper">
        <Button type="button" className="contained" onClick={save}>
          Accept
        </Button>
        <Button type="button" className="outlined" onClick={clear}>
          Clear
        </Button>
      </div>
    </Wrapper>
  );
}

export default SignaturePad;
