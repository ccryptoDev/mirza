import React from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 0;
  background: rgb(253, 237, 237);
`;

const Popup = styled(Dialog)`
  .MuiDialog-container .MuiDialog-paperWidthSm {
    max-width: 800px;
    margin-top: 10%;
  }

  .MuiDialog-scrollPaper {
    align-items: start;
  }

  @media screen and (max-width: 600px) {
    .MuiDialog-container .MuiDialog-paperWidthSm {
      border-radius: 0;
    }

    .MuiDialog-paper {
      margin: 0;
    }
  }
`;

const DialogTitle = ({ onClose, children }: any) => {
  return (
    <TitleWrapper>
      <h4> {children}</h4>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </TitleWrapper>
  );
};

const ModalDialog = ({
  children,
  open,
  handleClose,
  showHideButton = false,
  modalTitle,
  transparent,
}: {
  children: any;
  open: boolean;
  handleClose: any;
  showHideButton?: boolean;
  modalTitle?: any;
  transparent?: boolean;
}) => {
  return (
    <Popup
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      sx={{
        ".MuiBackdrop-root": {
          background: `${transparent ? "transparent" : ""}`,
        },
      }}
    >
      {modalTitle || showHideButton ? (
        <DialogTitle onClose={handleClose}>{modalTitle}</DialogTitle>
      ) : (
        ""
      )}
      {children}
    </Popup>
  );
};

export default ModalDialog;
