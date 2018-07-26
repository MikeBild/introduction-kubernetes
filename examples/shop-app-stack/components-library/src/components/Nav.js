import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 10px 0 10px 0;
`;

export default ({ children }) => (
  <Nav>
    <a href="/home">Home</a> | <a href="/docs">Docs</a> |{" "}
    <a href="/contact">Contact</a> | <a href="/products">Products</a>
    {children}
  </Nav>
);
