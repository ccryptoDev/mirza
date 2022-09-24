import styled from "styled-components";

export default styled.ul`
  padding-left: 0;
  border-radius: 4px;
  width: 100%;
  display: flex;
  gap: 24px;
  list-style: none;

  & button {
    border: none;
    &:disabled {
      & svg path {
        fill: var(--color-gray-3);
      }
    }
    & svg path {
      fill: var(--color-gray-2);
    }
  }

  & > .disabled > button {
    color: #777;
    cursor: not-allowed;
    background-color: #fff;
    border-color: #ddd;
  }

  & > li > button,
  .pagination > li > span {
    position: relative;
    padding: 6px;
    line-height: 1.42857143;
    text-decoration: none;
    background-color: #fff;
    cursor: pointer;
    outline: none;
  }

  & > .active > button {
    z-index: 2;
    color: #fff;
    cursor: default;
  }
  & > .disabled-active > button {
    z-index: 2;
    color: #fff;
    cursor: not-allowed;
    background-color: #337ab7;
    border-color: #337ab7;
  }
`;
