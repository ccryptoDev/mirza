import React, { useMemo } from "react";
import styled from "styled-components";
import Card from "../atoms/Cards";

type IconComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

type SummaryCardProps = {
  label: string;
  amount: number;
  icon: IconComponent;
  color?: string;
};

const Container = styled(Card)<{ color: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;

  p {
    margin-top: 2rem;
    font-size: 1.4rem;
    text-align: center;
    line-height: 150%;
    display: flex;
    flex-direction: column-reverse;
    gap: 1.8rem;

    strong {
      font-weight: 700;
      font-size: 4.8rem;
      line-height: 120%;
      color: ${({ color }) => color};
    }
  }
`;

const SummaryCard = ({
  label,
  amount,
  icon: Icon,
  color = "var(--color-purple-4)",
}: SummaryCardProps): JSX.Element => {
  const formattedAmount = useMemo(
    () =>
      amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [amount]
  );

  return (
    <Container color={color}>
      <Icon width={47} stroke={color} />
      <p>
        {label}:<strong>{formattedAmount}</strong>
      </p>
    </Container>
  );
};

export default SummaryCard;
