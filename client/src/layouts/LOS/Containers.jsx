import styled from "styled-components";

export const ContainerLg = styled.div`
  max-width: var(--container-large-width);
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
`;

export const ContainerInternal = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
`;
