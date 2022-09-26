import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../../atoms/Buttons/Regular";
import Card from "../../atoms/Cards";
import RadialProgressBar from "../../atoms/RadialProgressBar";
import Heading from "../../molecules/Typography/employee/Heading";
import VestingModal from "../../molecules/VestingModal";

const LearnMoreButton = styled(Button)`
  background: var(--color-purple-4);
  color: white;
  font-weight: 400;
  font-size: 1.6rem;
  text-transform: none;
  width: 100%;
  cursor: pointer;

  margin-top: 1.4rem;
`;

const Vesting = styled(Card)`
  display: grid;
  grid-template-columns: auto 1fr 35rem;
  grid-column-gap: 2.4rem;
  align-items: center;
  padding: 3rem;
  flex: 1;

  p {
    font-size: 1.6rem;
  }
`;

const Wrapper = styled.div`
  margin: 1.5rem 0;
`;

const VestingCard = () => {
  const [vestingModal, setVestingModal] = useState(false);
  return (
    <Wrapper>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <Heading hideDivider title="Vesting: Reduce your Loan Amounts" />
        <Vesting>
          <div>
            <RadialProgressBar
              percent={25}
              fillColor="#ff9362"
              trackColor="#f8ecdc"
            />
          </div>
          <p>
            Forgiven
            <br />
            per year
          </p>
          <div>
            <p>
              Learn more about how you could reduce your principal loan amount
              through vesting.
            </p>
            <LearnMoreButton
              type="button"
              onClick={() => setVestingModal(true)}
            >
              Learn more
            </LearnMoreButton>
          </div>
        </Vesting>
      </Card>
      <VestingModal
        open={vestingModal}
        onClose={() => setVestingModal(false)}
      />
    </Wrapper>
  );
};

export default VestingCard;
