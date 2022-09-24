import styled, { css } from "styled-components";

const common = css`
  font-family: "EuclidCircular";
  color: var(--color-gray-6);
`;

export const H1 = styled.h1`
  ${common};
  font-size: 48px;
  font-weight: 700;
  line-height: 57px;
`;

export const H2 = styled.h2`
  ${common};
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
`;

export const H3 = styled.h3`
  ${common};
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
`;

export const H4 = styled.h4`
  ${common};
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
`;

export const H5 = styled.h5`
  ${common};
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`;

export const TextXL = styled.p`
  ${common};
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
`;

export const TextL = styled.p`
  ${common};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
`;

export const TextM = styled.p`
  ${common};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
`;

export const TextS = styled.p`
  ${common};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
`;

export const TextXS = styled.p`
  ${common};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
`;

export const TextXXS = styled.p`
  ${common};
  font-size: 10px;
  font-weight: 400;
  line-height: 1.5;
`;
