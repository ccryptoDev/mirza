import React from "react";
import styled from "styled-components";
import {
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";

const Legend = styled.legend`
  writing-mode: vertical-rl;
  transform: rotate(0.5turn);
  opacity: 0.7;
  font-weight: 400;
  font-size: 1.2rem;
  letter-spacing: 0.24px;
  color: var(--color-gray-6);
`;

const ChartContainer = styled.div`
  padding: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.8rem;
`;

type MyLoanAtGlanceChartProps = {
  data: {
    name: string;
    leftAxis?: number;
    rightAxis?: number;
  }[];
};

const MyLoanAtGlanceChart = ({
  data,
}: MyLoanAtGlanceChartProps): JSX.Element => {
  return (
    <ChartContainer>
      <Legend>Loan repayment amount ($)</Legend>
      <ComposedChart width={680} height={300} data={data}>
        <CartesianGrid stroke="white" />
        <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          domain={[0, 200]}
          tickLine={false}
          tickCount={7}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 3000]}
          tickLine={false}
          tickCount={7}
        />
        <Tooltip />
        <Bar
          yAxisId="left"
          dataKey="leftAxis"
          barSize={31}
          fill="var(--color-green-4)"
          radius={6}
        />
        <Line
          yAxisId="right"
          dataKey="rightAxis"
          type="monotone"
          stroke="var( --color-orange-4)"
        />
      </ComposedChart>
      <Legend>Outstanding amount ($)</Legend>
    </ChartContainer>
  );
};

export default MyLoanAtGlanceChart;
