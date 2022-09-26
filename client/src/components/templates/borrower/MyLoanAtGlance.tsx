/* eslint-disable react/jsx-no-undef */
import React from "react";
import styled from "styled-components";
import Card from "../../atoms/Cards";
import MyLoanAtGlanceChartGraphic from "../../molecules/Charts/MyLoanAtGlanceChart";
import ToggleButton from "../../atoms/ToggleButton";
import { loanOverviewChartData } from "../../../mocks/chart.mock";
import Heading from "../../molecules/Typography/employee/Heading";

const Select = styled.select`
  border-color: var(--color-gray-2);
  border-radius: 6px;
  padding: 1rem 1.6rem;
`;

const LoanChartOptions = styled.div`
  display: flex;
  align-items: center;

  select {
    margin-right: 1.2rem;
  }
`;

const Wrapper = styled.div`
  margin: 1.5rem 0;
`;

const MyLoanAtGlance = () => {
  return (
    <Wrapper>
      <Card>
        <Heading hideDivider title="My Loan at Glance" />
        <LoanChartOptions>
          <Select defaultValue="year">
            <option value="year">Yearly view</option>
          </Select>
          <div style={{ flex: 1 }}>
            <Select defaultValue="2022">
              <option value="2022">2022</option>
            </Select>
          </div>
          <ToggleButton id="first-toggle-btn" label="Outstanding loan amount" />
        </LoanChartOptions>

        <MyLoanAtGlanceChartGraphic
          data={loanOverviewChartData.map((item) => ({
            name: item.month,
            leftAxis: item.loanRepaymentAmount,
            rightAxis: item.outstandingAmount,
          }))}
        />
      </Card>
    </Wrapper>
  );
};

export default MyLoanAtGlance;
