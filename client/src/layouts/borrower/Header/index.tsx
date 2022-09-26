import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MirzaLogo } from "../../../assets/svgs/logo/logo.svg";
import { ReactComponent as ChevronDown } from "../../../assets/svgs/icons/chevron/chevron-down.svg";

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 3.2rem;
  border-bottom: 1px solid var(--color-gray-3);
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;

  li {
    margin-right: 4.8rem;
    padding: 2px 0;
  }

  a {
    text-decoration: none;
    color: var(--color-purple-4);
  }

  li.current {
    border-bottom: 1px solid var(--color-purple-4);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserPhoto = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 4rem;
  height: 4rem;
`;

const navItems = [
  { to: "/borrower", label: "Dashboard" },
  { to: "/borrower/playground", label: "Playground" },
  { to: "/borrower/my-loan", label: "My Loan" },
  { to: "/borrower/resources", label: "Resources" },
];

const Header = (): JSX.Element => {
  const { pathname } = useLocation();

  return (
    <Container>
      <MirzaLogo />

      <nav>
        <NavList>
          {navItems.map((item) => (
            <li key={item.to} className={pathname === item.to ? "current" : ""}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </NavList>
      </nav>

      <UserInfo>
        <span>Joanna Doe</span>
        <ChevronDown
          width={16}
          stroke="var(--color-purple-4)"
          strokeWidth={3}
          style={{ margin: "0 1.6rem" }}
        />
        <UserPhoto src="https://limaomecanico.com.br/wp-content/uploads/2017/01/ryan-gosling-400x650.jpg" />
      </UserInfo>
    </Container>
  );
};

export default Header;
