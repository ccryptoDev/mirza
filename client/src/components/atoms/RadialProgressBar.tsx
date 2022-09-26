import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
`;

const RadialCircle = styled.svg<{
  percent: number;
  fillColor?: string;
  trackColor?: string;
}>`
  width: 95px;
  height: 95px;
  user-select: none;
  cursor: default;

  .track,
  .fill {
    fill: rgba(0, 0, 0, 0);
    stroke-width: 10;
    transform: rotate(90deg) translate(0px, -80px);
  }

  .track {
    stroke: ${(props) => props.trackColor || "#e0f7f1"};
  }

  .fill {
    stroke: ${(props) => props.fillColor || "var(--color-green-4)"};
    stroke-dasharray: 219.99078369140625;
    stroke-dashoffset: ${(props) =>
      ((100 - props.percent) / 100) * -219.99078369140625};
    transition: stroke-dashoffset 1s;
  }
`;

const Percent = styled.p`
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 30%;
  text-align: center;
  position: absolute;
  font-weight: 700;
  font-size: 3.2rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;

  small {
    font-size: 1.6rem;
    font-weight: 400;
  }
`;

type RadialProgressBarProps = {
  percent: number; // Integer between 1-100
  fillColor?: string;
  trackColor?: string;
  showCurrency?: boolean;
  amount?: number;
};

const RadialProgressBar = ({
  percent,
  fillColor,
  trackColor,
  showCurrency = false,
  amount,
}: RadialProgressBarProps): JSX.Element => {
  return (
    <Container>
      <RadialCircle
        percent={percent}
        fillColor={fillColor}
        trackColor={trackColor}
        x="0px"
        y="0px"
        viewBox="0 0 80 80"
      >
        <path className="track" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
        <path className="fill" d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0" />
      </RadialCircle>
      <Percent>
        {showCurrency ? (
          <>
            <small>$</small>
            {amount}
          </>
        ) : (
          <>
            {percent}
            <small>%</small>
          </>
        )}
      </Percent>
    </Container>
  );
};

export default RadialProgressBar;
