import React from "react";
import styled from "styled-components";
import { ReactComponent as MoneyIllustration } from "../../../assets/svgs/illustrations/money-illustration.svg";
import Card from "../../atoms/Cards";
import Heading from "../../molecules/Typography/employee/Heading";

const Wrapper = styled.div`
  padding: 4.8rem 4.8rem 1.4rem 4.8rem;
`;

const HeroTextCard = styled(Card)`
  padding: 1.5rem;
  padding-left: 4rem;
  display: flex;
  align-items: center;
  margin-bottom: 4rem;
`;

const HeroTextMessage = styled.div`
  flex-grow: 1;
`;

const HeroTextGreeting = styled.h1`
  font-weight: 700;
  font-size: 3.2rem;
  margin-bottom: 2.4rem;

  strong {
    font-size: 4.8rem;
    color: var(--color-green-4);
  }
`;

const HeroTextDescription = styled.p`
  font-size: 2rem;
  line-height: 150%;
`;

const Header = () => {
  return (
    <Wrapper>
      <HeroTextCard>
        <HeroTextMessage>
          <HeroTextGreeting>
            Good afternoon, <strong>Jon Doe</strong>
          </HeroTextGreeting>
          <HeroTextDescription>
            The full loan amount will be disbursed in monthly
            <br /> installments over 12 months.
          </HeroTextDescription>
        </HeroTextMessage>

        <MoneyIllustration />
      </HeroTextCard>
      <Heading hideDivider={false} title="Your Payments" />
    </Wrapper>
  );
};

export default Header;
