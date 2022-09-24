import { css } from "styled-components";

export const container = css`
  .container {
    max-width: 370px;
    width: 100%;
    margin: 68px auto 0;
  }
`;

export const header = css`
  .heading {
    color: var(--color-primary-green-1);
    text-align: center;
    margin: 24px 0;
  }

  .subtitle {
    text-align: center;
    color: var(--color-gray-2);
    font-weight: 600;
  }
`;

export const main = css`
  button {
    text-transform: upperCase;
  }
`;
