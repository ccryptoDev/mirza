import React from "react";
import styled from "styled-components";
import Progress from "../../../organisms/ProgressBar/LOS";
import { currentStep, numberOfSteps } from "./config";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0;
  gap: 10px;
  font-size: 14px;
  justify-content: space-between;
  .stepper-container {
    max-width: 1056px;
    width: 100%;
  }
`;

const ProgressBar = ({ currentRoute }: any) => {
  const currentStepNumber = currentStep(currentRoute);
  return (
    <Wrapper>
      <div>Step {currentStepNumber}</div>
      <div className="stepper-container">
        <Progress
          numberOfSteps={numberOfSteps}
          currentStepNumber={currentStepNumber}
        />
      </div>
      <div>
        <i>of {numberOfSteps}</i>
      </div>
    </Wrapper>
  );
};

export default ProgressBar;
