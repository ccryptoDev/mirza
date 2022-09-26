import React, { useRef } from "react";
import styled from "styled-components";
import Card from "../atoms/Cards";
import { ReactComponent as CloseIcon } from "../../assets/svgs/icons/actions/cross-sm.svg";
import SummaryCard from "./SummaryCard";
import VestingScheduleCard from "./VestingScheduleCard";
import * as myLoanMock from "../../mocks/myLoan.mock";

type VestingModalProps = {
  open: boolean;
  onClose: () => void;
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 1.8rem;
  padding: 6.4rem;
  width: 81%;
  max-height: 90%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 2.4rem;
`;

const Description = styled.p`
  font-size: 1.8rem;
  color: #4f4f4f;
  margin-bottom: 3.2rem;
  line-height: 150%;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 120%;
  margin-bottom: 3.2rem;
`;

const VestingSchedule = styled.div`
  display: flex;
  gap: 3rem;
  flex: 1;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  background: 0;
  border: 0;
  cursor: pointer;
`;

const Summary = styled.div`
  display: flex;
  gap: 3rem;

  * {
    flex: 1;
  }
`;

const VestingModal = ({
  open,
  onClose,
}: VestingModalProps): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <Container
      ref={containerRef}
      onClick={(e) => {
        const hasTouchedOutside = e.target === containerRef.current;
        if (hasTouchedOutside) {
          onClose();
        }
      }}
    >
      <Modal>
        <Header>
          <CloseButton onClick={onClose}>
            <CloseIcon width={24} height={24} />
          </CloseButton>
        </Header>
        <Title>Vesting options</Title>
        <Description>
          Your company can help you pay off your childcare loan every year. See
          how your principal loan amount can be automatically reduced
          year-on-year below.
        </Description>
        <Card>
          <CardTitle>Your vesting schedule</CardTitle>
          <VestingSchedule>
            {myLoanMock.vestingSchedule.map((item) => (
              <VestingScheduleCard
                key={item.id}
                title={item.title}
                loanAmount={item.loanAmount}
                forgivenPerYear={item.forgivenPerYear}
              />
            ))}
          </VestingSchedule>
        </Card>
        <Card style={{ marginTop: "3.2rem" }}>
          <CardTitle>Your summary</CardTitle>
          <Summary>
            {myLoanMock.summaryData.map((summary) => (
              <SummaryCard key={summary.label} {...summary} />
            ))}
          </Summary>
        </Card>
      </Modal>
    </Container>
  );
};

export default VestingModal;
