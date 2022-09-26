import React from "react";
import styled from "styled-components";
import InfoText from "../../atoms/InfoText";
import Card from "../../atoms/Cards";
import RadialProgressBar from "../../atoms/RadialProgressBar";
import Heading from "../../molecules/Typography/employee/Heading";

const CompletedPaymentsCard = styled(Card)`
  display: flex;
`;

const TimeframeCard = styled(Card)`
  display: flex;
  align-items: center;
`;

const TimeframeCards = styled.div`
  display: flex;
  margin-bottom: 2.4rem;

  ${TimeframeCard}, ${Card} {
    flex: 1;
    margin-right: 2.4rem;

    :last-child {
      margin-right: 0;
    }
  }
`;

const TimeToPayAmount = styled.p`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 1rem;

  strong {
    font-size: 4.8rem;
  }
`;

const ActivePaymentsCards = styled.div`
  display: flex;
  margin-bottom: 2.4rem;

  ${Card} {
    flex: 1;
    margin-right: 1.4rem;

    :last-child {
      margin-right: 0;
    }
  }
`;

const ActivePaymentsCardAmount = styled.p`
  font-size: 4.8rem;
  margin-bottom: 2.4rem;

  span {
    font-size: 3.2rem;
  }

  &,
  span {
    font-weight: 700;
  }
`;

const ActivePaymentsCardDescription = styled.p`
  font-size: 1.4rem;
`;

const Wrapper = styled(Card)`
  grid-row: 1 / 3;
  margin: 1.5rem 0;
`;

const ActivePaymentsCard = () => {
  return (
    <Wrapper>
      <Heading hideDivider title="Active Payments" />
      <ActivePaymentsCards>
        <Card>
          <ActivePaymentsCardAmount style={{ color: "var(--color-purple-4)" }}>
            <strong>
              $3,<span>000</span>
            </strong>
          </ActivePaymentsCardAmount>
          <ActivePaymentsCardDescription>
            Total amount of loan
          </ActivePaymentsCardDescription>
        </Card>
        <Card>
          <ActivePaymentsCardAmount style={{ color: "var(--color-green-4)" }}>
            <strong>
              $2,<span>844</span>
            </strong>
          </ActivePaymentsCardAmount>
          <ActivePaymentsCardDescription>
            Remaining balance
          </ActivePaymentsCardDescription>
        </Card>
        <Card>
          <ActivePaymentsCardAmount style={{ color: "#FF9362" }}>
            <strong>$78</strong>
          </ActivePaymentsCardAmount>
          <ActivePaymentsCardDescription>
            Monthly loan payment
          </ActivePaymentsCardDescription>
        </Card>
      </ActivePaymentsCards>

      <Heading hideDivider title="Timeframe" />
      <TimeframeCards>
        <TimeframeCard>
          <RadialProgressBar percent={6} />
          <p style={{ marginLeft: "2.4rem" }}>Already Paid</p>
        </TimeframeCard>
        <Card>
          <TimeToPayAmount>
            <strong>2</strong> years, 2 months
          </TimeToPayAmount>
          <p>Time to pay remaining balance</p>
        </Card>
      </TimeframeCards>

      <Heading hideDivider title="Completed Payments" />
      <CompletedPaymentsCard>
        <InfoText value="$1,666" label="Total amount of vested principal" />
        <InfoText value="Oct 11, 2021" label="Next scheduled payment date" />
      </CompletedPaymentsCard>
    </Wrapper>
  );
};

export default ActivePaymentsCard;
