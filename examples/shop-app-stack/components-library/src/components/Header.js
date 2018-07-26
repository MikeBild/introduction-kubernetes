import React from "react";
import styled from "styled-components";

const Header = styled.header`
  padding: 10px;
  width: 100%;
  background-color: lightgray;
  color: white;
`;

export default ({ children }) => <Header>{children}</Header>;
