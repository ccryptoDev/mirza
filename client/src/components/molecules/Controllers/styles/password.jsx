import { css } from "styled-components";
import { input } from "./input";

export const password = css`
  ${input}
  input {
    padding-right: 45px;
  }
  .icon {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translate(0, -50%);
  }
`;
