import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 12px;
  .row {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--color-gray-2);
    &:nth-child(odd) {
      background: #f4f4f4;
    }

    .value {
      &,
      & span {
        font-weight: 700;
      }
    }
  }
`;

const Table = ({
  items = [],
}: {
  items: { label: string; value: string }[];
}) => {
  return (
    <Wrapper className="table">
      {items.map((item) => {
        return (
          <div className="row" key={item.label}>
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Table;
