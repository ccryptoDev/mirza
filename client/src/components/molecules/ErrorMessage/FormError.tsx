import React from "react";
import styled from "styled-components";
import Modal from "../../organisms/Modals/Popup";
import { ReactComponent as Warning } from "../../../assets/svgs/icons/alerts/alert-circle.svg";

const Wrapper = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-danger);
  min-width: 300px;
  padding: 0 12px 12px 38px;
  background: rgb(253, 237, 237);
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    height: 18px;
    width: 18px;
    & path {
      stroke: var(--color-danger);
    }
  }

  font-weight: 500;
  color: var(--color-danger);
`;

const Title = ({ text }: { text: string }) => {
  return (
    <TitleWrapper>
      <Warning />
      {text}
    </TitleWrapper>
  );
};

export const ErrorAlert = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: any;
}) => {
  return (
    <Modal
      open={!!message}
      modalTitle={<Title text="Error" />}
      handleClose={() => setMessage("")}
      transparent
    >
      <Wrapper>{message}</Wrapper>
    </Modal>
  );
};
