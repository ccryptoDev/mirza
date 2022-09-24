import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 10px;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-gray-2);
`;

const Pages = ({ numberOfItems, itemsPerPage, skip = 0 }) => {
  const numberOfPages = Math.ceil(numberOfItems / itemsPerPage);
  const page = Math.floor(skip / itemsPerPage) + 1;
  return (
    <Wrapper className="pagesCounter">
      Page {page} of {numberOfPages}
    </Wrapper>
  );
};

export default Pages;
