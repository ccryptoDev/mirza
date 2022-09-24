import React, { useEffect } from "react";
import styled from "styled-components";

// INTER PAGE STEPPER THAT SHOWS DYNAMIC ANIMATION ON PAGE MOUNT

const ProgressBar = styled.div<{ progress: number }>`
  height: 10px;
  width: 100%;
  border-radius: 5px;
  position: relative;
  background: #c4c4c4;
  &:before {
    content: "";
    height: 100%;
    background: var(--color-purple-4);
    border-radius: 5px;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 0.3s;
    width: ${(props) => `${props.progress}%` || 0};
  }
`;

const LinearDeterminate = ({
  numberOfSteps,
  currentStepNumber,
}: {
  numberOfSteps: number;
  currentStepNumber: number;
}) => {
  const step = 100 / numberOfSteps;
  // (currentStepNumber - 1) is meant to set the progress bar to previous page state to create dynamic animation on the page load
  const [progress, setProgress] = React.useState(
    step * (currentStepNumber - 1)
  );

  useEffect(() => {
    setProgress(step * currentStepNumber);
  }, [currentStepNumber, step]);

  useEffect(() => {
    // this effect us used to set the progress bar to previous page state and add animation of dynamic progress on new page load
    if (progress === step * (currentStepNumber - 1)) {
      setTimeout(() => {
        setProgress(step * currentStepNumber);
      }, 200);
    }
  }, [progress, step, currentStepNumber]);

  return (
    <div className="progressbar">
      <ProgressBar progress={progress} />
    </div>
  );
};

export default LinearDeterminate;
