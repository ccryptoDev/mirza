/* eslint-disable react/jsx-no-undef */
import React from "react";
import styled from "styled-components";
import Card from "../../atoms/Cards";
import { ReactComponent as ContactSupportIllustration } from "../../../assets/svgs/illustrations/contact-support-illustration.svg";
import Heading from "../../molecules/Typography/employee/Heading";

const EmailLink = styled.a`
  text-decoration: none;
`;

const ContactSupport = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    line-height: 150%;
  }
`;

const Wrapper = styled.div`
  display: grid;
  margin: 1.5rem 0;
`;

const ContactSupportCard = () => {
  return (
    <Wrapper>
      <ContactSupport>
        <div>
          <Heading fontSize="3.2rem" hideDivider title="Contact Support" />
          <p>
            For help with your loan management or if you have any questions,
            please contact your support team.
          </p>
          <p>
            Email us at{" "}
            <EmailLink href="mailto:support@heymirza.com">
              support@heymirza.com
            </EmailLink>
          </p>
        </div>
        <div>
          <ContactSupportIllustration />
        </div>
      </ContactSupport>
    </Wrapper>
  );
};

export default ContactSupportCard;
