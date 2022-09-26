import React from "react";
import styled from "styled-components";

const LoanTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  thead {
    background: var(--color-gray-2);
  }

  th {
    background: var(--color-gray-2);
    font-weight: 700;
    font-size: 1.4rem;
    padding: 1.8rem 3.2rem;
    border: 1px solid var(--color-gray-2);
    text-align: left;
  }

  th.hidden {
    visibility: hidden;
  }

  td {
    border-style: solid;
    border-color: var(--color-gray-2);
    border-width: 0;
    border-bottom-width: 1px;
    padding: 1rem 3.2rem;
    font-size: 1.4rem;
  }

  td:first-child {
    border-left-width: 1px;
  }

  td:last-child {
    border-right-width: 1px;
  }

  td.spacy {
    letter-spacing: 2px;
  }

  tr:nth-child(even) td {
    background: var(--color-gray-1);
  }

  .right-aligned {
    text-align: right;
  }
`;

type Transaction = {
  month: string;
  date: string;
  disbursement: string;
  repayment: string;
  loanBalance: string;
  paymentRef: string;
};

type TransactionsTableProps = {
  currentTransactions: Transaction[];
  futureTransactions: Transaction[];
};

const TransactionsTable = ({
  currentTransactions,
  futureTransactions,
}: TransactionsTableProps): JSX.Element => {
  return (
    <>
      <LoanTable>
        <thead>
          <tr>
            <th>Month</th>
            <th>Date</th>
            <th className="right-aligned">Disbursement</th>
            <th className="right-aligned">Repayment</th>
            <th className="right-aligned">Loan balance</th>
            <th className="right-aligned">Payment ref</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction.month}>
              <td>{transaction.month}</td>
              <td>{transaction.date}</td>
              <td className="spacy right-aligned">
                {transaction.disbursement}
              </td>
              <td className="right-aligned">{transaction.repayment}</td>
              <td className="spacy right-aligned">{transaction.loanBalance}</td>
              <td className="right-aligned">{transaction.paymentRef}</td>
            </tr>
          ))}
        </tbody>
        {/* Future Payments */}
        <thead>
          <tr>
            <th colSpan={6}>For future payments...</th>
          </tr>
        </thead>
        <tbody style={{ opacity: "0.5" }}>
          {futureTransactions.map((transaction) => (
            <tr key={transaction.month}>
              <td>{transaction.month}</td>
              <td>{transaction.date}</td>
              <td className="spacy right-aligned">
                {transaction.disbursement}
              </td>
              <td className="right-aligned">{transaction.repayment}</td>
              <td className="spacy right-aligned">{transaction.loanBalance}</td>
              <td className="right-aligned">{transaction.paymentRef}</td>
            </tr>
          ))}
        </tbody>
      </LoanTable>
    </>
  );
};

export default TransactionsTable;
