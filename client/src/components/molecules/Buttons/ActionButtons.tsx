import React from "react";
import styled from "styled-components";
import GoBackButton from "./GoBack";
import { ReactComponent as EditIcon } from "../../../assets/svgs/pencil.svg";
import { ReactComponent as CheckedIcon } from "../../../assets/svgs/checked.svg";
import { ReactComponent as CanceldIcon } from "../../../assets/svgs/error.svg";
import { circle } from "../../atoms/Elements/Circle";

const Button = styled.button`
  ${circle}
  width: 32px;
  height: 32px;

  cursor: pointer;

  &.edit {
    border: none;
    background: transparent;
    border-radius: 0;
    width: 16px;
    height: 16px;

    & svg {
      & path {
        fill: #5a514f;
      }
    }
  }

  &.save {
    background: var(--color-green-1);
    & svg {
      height: 7px;
      width: 11px;
      & path {
        fill: #fff;
      }
    }
  }

  &.cancel {
    background: var(--color-green-5);
    & svg {
      height: 13px;
      width: 13px;
    }
    & path {
      fill: var(--color-green-1);
    }
  }
  .preloader {
    margin-top: 3px;
  }
`;

const ActionButton = ({
  onClick,
  type,
}: {
  onClick?: any;
  type: "goback" | "edit" | "save" | "cancel";
}) => {
  const renderIcon = () => {
    if (type === "edit") {
      return (
        <Button className="edit" onClick={onClick}>
          <EditIcon />
        </Button>
      );
    }
    if (type === "save") {
      return (
        <Button className="save" onClick={onClick}>
          <CheckedIcon />
        </Button>
      );
    }
    if (type === "cancel") {
      return (
        <Button className="cancel" onClick={onClick}>
          <CanceldIcon />
        </Button>
      );
    }
    if (type === "goback") {
      return <GoBackButton />;
    }

    return <></>;
  };
  return renderIcon();
};

export default ActionButton;
