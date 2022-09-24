import { css } from "styled-components";
import { isValid, isError } from "./activities";

export const input = css`
  background: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: EuclidCircular;

  input,
  select,
  textarea {
    width: 100%;
    padding: 11px 20px;
    font-size: 16px;
    outline: none;
    border-radius: 6px;
    border: 1px solid var(--color-gray-4);
    color: var(--color-gray-6);
    box-sizing: border-box;
    position: relative;
    font-weight: 400;
    line-height: 1.5;
    z-index: 2;
    transition: all 0.2s;
    &::placeholder {
      color: #b7b7b7;
    }

    &:hover {
      background: #f9f9f9;
      border-color: #ebebeb;
    }
    &:focus {
      border: 1px solid var(--color-gray-4);
      color: var(--color-gray-6);
    }
  }

  ${isValid}
  ${isError}
`;
