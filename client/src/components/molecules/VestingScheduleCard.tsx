/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import styled from "styled-components";
import Card from "../atoms/Cards";
import RadialProgressBar from "../atoms/RadialProgressBar";

const Container = styled(Card)`
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h3 {
    font-weight: 400;
    font-size: 1.8rem;
    text-align: center;
    color: var(--color-gray-4);
    margin-bottom: 2.3rem;
  }

  p.amount {
    font-size: 1.4rem;
    line-height: 150%;
    text-align: center;

    strong {
      display: block;
      font-weight: 700;
      font-size: 4.8rem;
      line-height: 120%;
    }
  }
`;

const Divider = styled.div`
  content: "";
  background: var(--color-gray-2);
  width: 58%;
  height: 1px;
  margin: 2.3rem 0;
`;

const ToggleButtons = styled.div`
  display: flex;
`;

const ToggleButton = styled.div<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected ? "var(--color-purple-4)" : "transparent"};
  color: var(
    ${({ selected }) => (selected ? "--color-white" : "--color-purple-4")}
  );
  border: 1px solid var(--color-purple-4);
  font-size: 1.6rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem 1.2rem;

  input[type="radio"] {
    appearance: none;
  }

  &,
  label {
    cursor: ${({ selected }) => (selected ? "default" : "pointer")};
  }

  :first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  :last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

type VestingScheduleCardProps = {
  title: string;
  loanAmount: number;
  forgivenPerYear: {
    percent: number;
    amount: number;
  };
};

type LoanUnits = "percent" | "amount";

const types: LoanUnits[] = ["percent", "amount"];

const VestingScheduleCard = ({
  title,
  loanAmount,
  forgivenPerYear,
}: VestingScheduleCardProps): JSX.Element => {
  const [currentType, setCurrentType] = useState<LoanUnits>(
    types[0] as LoanUnits
  );
  const formattedAmount = `$${loanAmount}`;

  const radialBarColors = {
    percent: {
      fill: "var(--color-orange-4)",
      track: "var(--color-orange-1)",
    },
    amount: {
      fill: "var(--color-green-4)",
      track: "var(--color-green-1)",
    },
  };

  return (
    <Container>
      <h3>{title}</h3>
      <p className="amount">
        <strong>{formattedAmount}</strong>
        Loan amount:
      </p>
      <Divider />
      <Details>
        <RadialProgressBar
          percent={forgivenPerYear.percent}
          amount={forgivenPerYear.amount}
          showCurrency={currentType === "amount"}
          fillColor={radialBarColors[currentType].fill}
          trackColor={radialBarColors[currentType].track}
        />
        <span>
          Forgiven
          <br />
          per year
        </span>
        <ToggleButtons>
          {types.map((type) => (
            <ToggleButton
              key={type}
              selected={type === currentType}
              onClick={() => setCurrentType(type)}
            >
              <input type="radio" value={type} checked={type === currentType} />
              <label>{{ percent: "%", amount: "#" }[type]}</label>
            </ToggleButton>
          ))}
        </ToggleButtons>
      </Details>
    </Container>
  );
};

export default VestingScheduleCard;
