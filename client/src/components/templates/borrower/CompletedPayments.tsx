/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import styled from "styled-components";
import InfoText from "../../atoms/InfoText";
import Card from "../../atoms/Cards";
import TransactionsModal from "../../molecules/TransactionsModal";
import * as myLoanMock from "../../../mocks/myLoan.mock";
import Heading from "../../molecules/Typography/employee/Heading";

const CompletedPaymentsCard = styled(Card)`
  display: flex;
  margin-bottom: 2.4rem;
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    font-weight: 700;
    font-size: 1.4rem;
    padding-bottom: 0.7rem;
  }

  td {
    padding: 1.6rem 0;
    border-bottom: 0.5px solid var(--color-gray-2);
    font-size: 1.4rem;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  col {
    text-align: right;
  }

  th.status,
  td.status,
  td.actions {
    text-align: right;
  }

  th.payment {
    text-align: left;
  }

  td.method {
    text-align: center;
  }

  td.status.paid {
    color: var(--color-green-4);
  }

  td.status.past-due {
    color: var(--color-danger);
  }

  td.actions button {
    background: 0;
    border: 0;
    color: var(--color-purple-4);
  }
`;

const PaymentTableMenu = styled.div`
  display: flex;
  margin-bottom: 3.4rem;

  button {
    background: transparent;
    border: 0;
    color: #828282;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.4rem;
    padding-bottom: 0.5rem;
    border-bottom-width: 3px;
    border-bottom-style: solid;
    border-bottom-color: transparent;
    letter-spacing: 0.2px;
    cursor: pointer;

    :not(:last-child) {
      margin-right: 6.4rem;
    }

    &.selected {
      color: var(--color-purple-4);
      border-bottom-color: var(--color-purple-4);
    }
  }
`;

const Wrapper = styled.div`
  margin: 1.5rem 0;
`;

const CompletedPayments = (): JSX.Element => {
  const [transactionsModal, setTransactionsModal] = useState(false);
  const [paymentType, setPaymentType] =
    useState<"UPCOMING" | "PAST">("UPCOMING");
  const paymentsData = myLoanMock.payments[paymentType];
  return (
    <Wrapper>
      <Card>
        <Heading hideDivider title="Completed Payments" />
        <CompletedPaymentsCard>
          <InfoText value="2" label="Total number of completed payments" />
          <InfoText value="Oct 11, 2021" label="Next scheduled payment date" />
        </CompletedPaymentsCard>
        <Heading hideDivider title="Transactions" />
        <PaymentTableMenu>
          <button
            type="button"
            className={paymentType === "UPCOMING" ? "selected" : ""}
            onClick={() => setPaymentType("UPCOMING")}
          >
            Upcoming payment
          </button>
          <button
            type="button"
            className={paymentType === "PAST" ? "selected" : ""}
            onClick={() => setPaymentType("PAST")}
          >
            Past Payment
          </button>
        </PaymentTableMenu>
        <Card>
          <TransactionsTable>
            <thead>
              <tr>
                <th className="payment">Payment Date:</th>
                <th className="method">Method:</th>
                <th className="status">Status:</th>
                <th className="actions"> </th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.map((payment) => (
                <tr key={payment.id}>
                  <td className="payment">{payment.date}</td>
                  <td className="method">{payment.method}</td>
                  <td
                    className={`status ${
                      {
                        PAST_DUE: "past-due",
                        PAID: "paid",
                      }[payment.status]
                    }`}
                  >
                    {
                      {
                        UPCOMING: "Upcoming",
                        PAST_DUE: "Past Due",
                        PAID: "Paid",
                      }[payment.status]
                    }
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      onClick={() => setTransactionsModal(true)}
                    >
                      {
                        {
                          UPCOMING: "View Details",
                          PAST_DUE: "Make Payment",
                          PAID: "Payment Scheduled",
                        }[payment.status]
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TransactionsTable>
        </Card>
      </Card>
      <TransactionsModal
        open={transactionsModal}
        onClose={() => setTransactionsModal(false)}
      />
    </Wrapper>
  );
};

export default CompletedPayments;
