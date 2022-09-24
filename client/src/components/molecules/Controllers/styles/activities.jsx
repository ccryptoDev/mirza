import { css } from "styled-components";

export const isValid = css`
  &.isValid {
    & input,
    & textarea {
      border-color: transparent;
      border-radius: 6px;
      box-shadow: 0 0 0 2px #06c270;

      &:focus {
        border-color: transparent;
        box-shadow: 0 0 0 2px #06c270;
      }
    }
  }
`;

export const isError = css`
  & .error {
    margin: 5px 0 0 5px;
  }
  &.isError {
    & .input-wrapper .field-label {
      color: var(--color-functional-red-1);
    }
    & .input-wrapper {
      & input,
      & select,
      & textarea {
        &,
        &:hover,
        &:active,
        &:focus {
          border-color: var(--color-functional-red-1);
        }
      }
    }
  }
`;
