import React from "react";
import styled from "styled-components";
import Layout from "../../../layouts/LOS/Login";
import { ReactComponent as Logo } from "../../../assets/svgs/icons/logos/react-logo.svg";
import LoginForm from "../../../components/templates/LOS/authorization/Login";

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  .logo {
    height: 100px;
    width: 100px;
  }
`;

const Login = () => {
  return (
    <Layout>
      <div>
        <LogoWrapper>
          <Logo className="logo" />
        </LogoWrapper>
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
