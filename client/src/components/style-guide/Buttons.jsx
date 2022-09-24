import React from "react";
import styled from "styled-components";
import { Button } from "../atoms/Buttons/Regular";
import { ReactComponent as Arrow } from "../../assets/svgs/icons/arrow/arrow-right.svg";
import SubmitBtn from "../molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: flex;
    column-gap: 20px;
    padding: 20px;
  }

  .inverted {
    background: #000;
  }
`;

const Guide = () => {
  return (
    <Wrapper>
      <section>
        <Button className="contained">Contained</Button>
        <Button className="outlined">Outlined</Button>
        <Button className="text icon">
          Text <Arrow />
        </Button>
        <Button className="contained icon">
          Continue
          <Arrow />
        </Button>
      </section>
      <section className="inverted">
        <Button className="contained-inverted">Contained</Button>
        <Button className="outlined-inverted">Outlined</Button>
        <Button className="text-inverted icon">
          Text <Arrow />
        </Button>
        <Button className="contained-inverted icon">
          Continue
          <Arrow />
        </Button>
      </section>

      <section>
        <p>Button with loader:</p>
        <SubmitBtn loading>loading...</SubmitBtn>
      </section>
    </Wrapper>
  );
};

export default Guide;
