import { css } from "styled-components";
import { input } from "./input";
import logo from "../Select/chevron-down.svg";

export const select = css`
  ${input}

  select {
    appearance: none;
    padding-right: 30px;
    min-width: 120px;
  }
  .select-wrapper {
    background: #fff;
    border: transparent;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      height: 6px;
      width: 11px;
      right: 5px;
      top: 50%;
      transform: translate(-50%, -50%);
      background: url("${logo}") no-repeat;
      pointer-events: none;
      z-index: 10;
    }
  }
`;
