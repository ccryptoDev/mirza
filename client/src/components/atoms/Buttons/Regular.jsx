import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const buttonIcon = css`
  svg {
    height: 18px;
  }
`;

export const text = css`
  font-weight: 400;
  background: transparent;
  color: var(--color-purple-4);
  border: none;

  & svg path {
    stroke: var(--color-purple-4);
  }

  &:focus {
    outline: 1px dashed var(--color-purple-4);
  }

  &:hover,
  &:active {
    border: none;
    color: var(--color-purple-4);
    text-decoration: underline;
  }
`;

export const textInverted = css`
  font-weight: 400;
  background: transparent;
  color: #fff;
  border: none;

  & svg path {
    stroke: #fff;
  }

  &:focus {
    outline: 1px dashed #fff;
  }

  &:hover,
  &:active {
    border: none;
    color: #fff;
    text-decoration: underline;
  }
`;

export const button = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  cursor: pointer;
  transition: all 0.2s;
  padding: 0 20px;
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1.5;
  height: 48px;
  font-family: EuclidCircular;

  &:focus {
    outline: 3px solid var(--color-purple-2);
  }

  &.contained {
    background: var(--color-purple-4);
    color: #fff;

    & svg path {
      stroke: #fff;
    }

    &:hover,
    &:active,
    &:focus {
      background: var(--color-purple-5);
    }

    &:disabled {
      background: var(--color-purple-5);
    }
  }

  &.contained-inverted {
    background: #fff;
    color: var(--color-purple-4);

    & svg path {
      stroke: var(--color-purple-4);
    }

    &:hover,
    &:active,
    &:focus {
      background: var(--color-purple-3);
      color: #fff;
    }

    &:disabled {
      background: var(--color-purple-5);
    }
  }

  &.outlined {
    background: transparent;
    color: var(--color-purple-4);
    border: 1px solid var(--color-purple-4);
    & svg path {
      stroke: var(--color-purple-4);
    }
    &:hover,
    &:active,
    &:focus {
      border: 1px solid var(--color-purple-4);
      background: var(--color-purple-4);
      color: #fff;
    }

    &:disabled {
      border: 1px solid var(--color-purple-5);
      color: var(--color-purple-5);
    }
  }

  &.outlined-inverted {
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    & svg path {
      stroke: #fff;
    }
    &:hover,
    &:active,
    &:focus {
      border: 1px solid var(--color-purple-4);
      background: var(--color-purple-4);
      color: #fff;
    }

    &:disabled {
      border: 1px solid var(--color-purple-5);
      color: var(--color-purple-5);
    }
  }

  &.text {
    ${text}
  }

  &.text-inverted {
    ${textInverted}
  }

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const buttonCircle = css`
  background: #fff;
  border: 1px solid var(--color-primary-green-1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonContent = styled.div`
  ${button}
`;

export const Button = styled.button`
  ${button}
  &.icon {
    ${buttonIcon}
  }
`;

export const LinkButton = styled(Link)`
  ${button}
  text-decoration: none;
  text-align: center;
`;
