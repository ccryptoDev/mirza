import { css } from "styled-components";
import { input } from "./input";

export const datePicker = css`
  ${input}
  .MuiFormControl-root {
    width: 100%;
  }
  .MuiInput-underline {
    &:before,
    &:after {
      content: "";
      display: none;
    }
  }
  & input {
    box-sizing: content-box;
    padding: 13px 16px;
    font-size: 16px;
  }
`;

export const datePickerMui = css`
  font-family: EuclidCircular;

  /* FIELD BACKGROUND */
  .MuiTextField-root {
    background: var(--color-bg-2);
  }

  /* FIELD BORDER */
  .MuiOutlinedInput-root.MuiInputBase-root {
    & fieldset {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid var(--color-gray-2);
    }

    &.Mui-focused {
      & fieldset {
        border-bottom: 1px solid var(--color-green-1);
      }
    }
  }

  /* INPUT */
  & .MuiInputBase-input {
    font-size: 16px;
    font-size: 14px;
    color: #5a514f;
    padding: 20px 16px;
    height: 58px;
    box-sizing: border-box;
  }

  /* LABEL */
  & .MuiInputLabel-root {
    font-size: 14px;
    line-height: 1.5;
    transform: translate(20px, 100%);

    &.MuiInputLabel-formControl {
      color: var(--color-gray-2);
      font-family: EuclidCircular;
      font-weight: 400;

      /* LABEL UP */
      &.Mui-focused,
      &.MuiFormLabel-filled {
        color: var(--color-green-1);
        transform: translate(16px, -50%);
        font-size: 12px;
      }
    }
  }

  /* ICON */
  & .MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }

  /* ON VALUE PRESENCE */
  &.isFilled {
    & .MuiOutlinedInput-root.MuiInputBase-root fieldset {
      border-bottom: 1px solid var(--color-green-1);
    }

    & .MuiSvgIcon-root {
      & path {
        fill: var(--color-green-1);
      }
    }
  }

  /* ON ERROR MESSAGE */
  &.isError {
    & .error {
      margin: 5px 0 0 5px;
    }
    /* LABEL */
    .MuiInputLabel-root.MuiInputLabel-outlined.MuiFormLabel-root {
      color: #bd5555;
    }

    /* FIELD BORDER */
    & .MuiOutlinedInput-root.MuiInputBase-root fieldset {
      border-color: #bd5555;
    }
  }
`;
