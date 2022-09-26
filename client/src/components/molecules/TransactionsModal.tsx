import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as ChevronDown } from "../../assets/svgs/icons/chevron/chevron-down.svg";
import { ReactComponent as ChevronUp } from "../../assets/svgs/icons/chevron/chevron-up.svg";
import { ReactComponent as DownloadIcon } from "../../assets/svgs/icons/arrow/download.svg";
import { ReactComponent as EmailIcon } from "../../assets/svgs/icons/contact/email.svg";
import TransactionsTable from "./TransactionsTable";
import {
  currentTransactions,
  futureTransactions,
} from "../../mocks/myLoan.mock";

type TransactionsModalProps = {
  open: boolean;
  onClose: () => void;
};

type Loan = {
  id: number;
  title: string;
  currentTransactions: any[];
  futureTransactions: any[];
  active: boolean;
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

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 2.4rem;
`;

const Description = styled.p`
  font-size: 1.8rem;
  color: #4f4f4f;
  margin-bottom: 6.4rem;
`;

const Details = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: 3.2rem;
`;

const DetailsItemAttribute = styled.span`
  width: 16rem;
`;

const DetailsItemValue = styled.span`
  font-weight: 700;
`;

const DetailsItem = styled.li`
  display: flex;
  gap: 6.4rem;
`;

const LoanTableDropdown = styled.div<{ active: boolean }>`
  background: var(--color-purple-4);
  color: white;
  padding: 1.6rem 2.4rem;
  border-radius: 1.2rem 1.2rem 0 0;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 2px;
  opacity: ${(props) => (props.active ? "1" : "0.5")};

  span {
    flex: 1;
    font-weight: 700;
  }
`;

const IconButton = styled.button`
  background: 0;
  border: 0;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: white;
`;

const loans: Loan[] = [
  {
    id: 1,
    title: "Year 1 of loan (Mar 2022-Feb 2023)",
    currentTransactions,
    futureTransactions,
    active: true,
  },
  {
    id: 2,
    title: "Year 2 of loan (Mar 2023-Feb 2024)",
    currentTransactions,
    futureTransactions,
    active: true,
  },
  {
    id: 3,
    title: "Year 3 of loan (Mar 2024-Feb 2025)",
    currentTransactions,
    futureTransactions,
    active: false,
  },
];

const TransactionsModal = ({
  open,
  onClose,
}: TransactionsModalProps): JSX.Element | null => {
  const [tableOpen, setTableOpen] = useState<number | undefined>(undefined);
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
        <Title>Transactions overview</Title>
        <Description>
          Your transaction amount may vary month-to-month based on our repayment
          smoothing method.
        </Description>

        <Details>
          <DetailsItem>
            <DetailsItemAttribute>Original loan:</DetailsItemAttribute>
            <DetailsItemValue>$3,000 ($1,000 per year)</DetailsItemValue>
          </DetailsItem>
          <DetailsItem>
            <DetailsItemAttribute>Current balance:</DetailsItemAttribute>
            <DetailsItemValue>$2,844</DetailsItemValue>
          </DetailsItem>
          <DetailsItem>
            <DetailsItemAttribute>Full repayment:</DetailsItemAttribute>
            <DetailsItemValue>30 Feb 2024</DetailsItemValue>
          </DetailsItem>
          <DetailsItem>
            <DetailsItemAttribute>Account number:</DetailsItemAttribute>
            <DetailsItemValue style={{ flex: 1 }}>487696</DetailsItemValue>
            <IconButton
              style={{
                color: "var(--color-purple-4)",
              }}
            >
              Contact
              <EmailIcon stroke="var(--color-purple-4)" width={15} />
            </IconButton>
            <IconButton
              style={{
                color: "var(--color-purple-4)",
              }}
            >
              Export all data
              <DownloadIcon stroke="var(--color-purple-4)" width={15} />
            </IconButton>
          </DetailsItem>
        </Details>

        {loans.map((loan) => (
          <>
            <LoanTableDropdown key={loan.id} active={loan.active}>
              <IconButton
                type="button"
                disabled={!loan.active}
                onClick={() =>
                  setTableOpen(
                    tableOpen === undefined || tableOpen !== loan.id
                      ? loan.id
                      : undefined
                  )
                }
              >
                {tableOpen === loan.id ? (
                  <ChevronUp width={16} stroke="white" />
                ) : (
                  <ChevronDown width={16} stroke="white" />
                )}
              </IconButton>
              <span>{loan.title}</span>
              <IconButton type="button">
                Export statement
                <DownloadIcon width={16} stroke="white" />
              </IconButton>
            </LoanTableDropdown>
            {tableOpen === loan.id && (
              <TransactionsTable
                currentTransactions={loan.currentTransactions}
                futureTransactions={loan.futureTransactions}
              />
            )}
          </>
        ))}
      </Modal>
    </Container>
  );
};

export default TransactionsModal;
