import React from "react";
import styled from "styled-components";

const SectionTitle = styled.h2<{
  hideDivider?: boolean;
  fontSize?: string | undefined;
}>`
  font-size: ${(props) => (props.fontSize ? props.fontSize : "2.4rem")};
  font-weight: 700;
  margin-bottom: 2.4rem;
  padding-bottom: ${(props) => (props.hideDivider ? "0" : "2rem")};
  border-bottom-width: ${(props) => (props.hideDivider ? "0" : "1px")};
  border-bottom-style: solid;
  border-bottom-color: var(--color-gray-2);
`;

type IDetailsHeading = {
  title: string;
  hideDivider: boolean;
  fontSize?: string | undefined;
};

const Heading = ({ title, hideDivider, fontSize }: IDetailsHeading) => {
  return (
    <SectionTitle hideDivider={hideDivider} fontSize={fontSize || undefined}>
      {title}
    </SectionTitle>
  );
};

export default Heading;
