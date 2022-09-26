import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/gay-couple-2.svg";
import { mockRequest } from "../../utils/mockRequest";
import {
  H1 as Heading,
  H3 as Subheading,
  H5,
  TextM as Text,
} from "../../components/atoms/Typography";
import { ReactComponent as EmailIcon } from "../../assets/svgs/icons/contact/envelope.svg";
import { ReactComponent as Arrow } from "../../assets/svgs/icons/arrow/arrow-right.svg";
import SubmitButton from "../../components/molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;

  .content-wrapper {
    & .heading {
      margin-bottom: 16px;
    }

    & .subheading {
      margin-bottom: 32px;
    }

    & .text-heading {
      margin-bottom: 12px;
    }

    & .text {
      margin-bottom: 40px;
    }

    & .submit-btn {
      max-width: 270px;
      width: 100%;
    }

    & .email-wrapper {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 40px;

      & svg path {
        stroke: var(--color-purple-4);
      }

      & .email-link {
        font-size: 18px;
        line-height: 1.5;
        color: var(--color-purple-4);
        margin-bottom: 4px;
      }
    }
  }
`;

const Completion = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmitHandler = async () => {
    setLoading(true);
    await mockRequest(3000);
    history.push(routes.INCOME);
  };

  return (
    <Layout>
      <ProgressBar currentRoute={routes.COMPLETION} />
      <Wrapper>
        <div className="content-wrapper">
          <Heading className="heading">Congratulations!</Heading>
          <Subheading className="subheading">
            Your loan’s all set up.
          </Subheading>
          <H5 className="text-heading">What happens next?</H5>
          <Text className="text">
            Your first disbursement will occur on the first business day of the
            next month, and will continue for the next 12 months following.{" "}
            <br />
            <br />
            If you have any questions at all, please get in touch with us.
          </Text>
          <div className="email-wrapper">
            <EmailIcon />{" "}
            <a href="mailto:support@heymirza.com" className="email-link">
              support@heymirza.com
            </a>
          </div>
          <SubmitButton
            type="button"
            loading={loading}
            className="submit-btn contained"
            onClick={onSubmitHandler}
          >
            See your loan dashboard
            <Arrow />
          </SubmitButton>
        </div>
        <Img />
      </Wrapper>
    </Layout>
  );
};

export default Completion;
