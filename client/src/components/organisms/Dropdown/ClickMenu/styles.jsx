import styled from "styled-components";
import Popper from "@material-ui/core/Popper";

export const Wrapper = styled.div`
  .MuiButtonBase-root {
    min-width: 40px;
    border-radius: 0;
    border: none;
    border-radius: 0;
    text-transform: initial;
    &:hover {
      background: #fff;
    }
  }

  & .trigger-button {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }
`;

export const DropDown = styled(Popper)`
  background: transparent;
  z-index: 999;
`;
