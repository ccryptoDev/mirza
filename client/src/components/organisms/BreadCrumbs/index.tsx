import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as Chevron } from "./chevron-right.svg";

const Wrapper = styled.div`
  &,
  & .prevStep {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;

    & svg {
      width: 6px;
    }
  }

  & .prevStep a {
    color: var(--color-gray-2);
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    &:hover {
      text-decoration: underline;
    }
  }

  & .currentStep {
    color: var(--color-green-1);
    font-weight: 700;
  }
`;

const renderLinks = (items: any) => {
  return items.map((item: any, index: number, array: any[]): any => {
    if (index === array.length - 1) {
      return (
        <div key={item.id} className="currentStep">
          {item.label}
        </div>
      );
    }
    return (
      <div key={item.id} className="prevStep">
        <Link to={item.link}>{item.label}</Link>
        <Chevron />
      </div>
    );
  });
};

const BreadCrumbs = ({
  items,
}: {
  items: { label: string; link: string; id: string }[];
}) => {
  return <Wrapper>{renderLinks(items)}</Wrapper>;
};

export default BreadCrumbs;
