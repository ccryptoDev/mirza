import React from "react";
import styled from "styled-components";
import Button from "../../components/style-guide/Buttons";
import Inputs from "../../components/style-guide/Inputs";
import Icons from "../../components/style-guide/Icons";
import Colors from "../../components/style-guide/Colors";
import Typography from "../../components/style-guide/Typography";
import BreadCrumbs from "../../components/style-guide/BreadCrumbs";
import Illustrations from "../../components/style-guide/Illustrations";

const Wrapper = styled.div`
  padding: 40px;
`;

const Guide = () => {
  return (
    <Wrapper>
      <Button />
      <BreadCrumbs />
      <Inputs />
      <Typography />
      <Icons />
      <Colors />
      <Illustrations />
    </Wrapper>
  );
};

export default Guide;
