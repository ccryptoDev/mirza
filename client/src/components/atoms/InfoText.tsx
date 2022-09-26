import React from "react";
import styled from "styled-components";

type InfoTextProps = {
  value: string;
  label: string;
  valueStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
};

const Container = styled.div`
  flex: 1;

  :not(:last-child) {
    border-right: 1px solid var(--color-gray-2);
    margin-right: 2.4rem;
  }
`;

const Value = styled.p`
  font-weight: 700;
  font-size: 3.2rem;
  margin-bottom: 1rem;
`;

const Label = styled.p`
  font-size: 1.4rem;
  line-height: 150%;
`;

const InfoText = ({
  value,
  label,
  valueStyle,
  labelStyle,
}: InfoTextProps): JSX.Element => {
  return (
    <Container>
      <Value style={valueStyle}>
        <strong>{value}</strong>
      </Value>
      <Label style={labelStyle}>{label}</Label>
    </Container>
  );
};

export default InfoText;
