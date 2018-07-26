import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 10px;
`;

export default ({ children }) => (
  <Nav>
    <ul>
      {React.Children.map(children, (child, i) => <li key={i}>{child}</li>)}
    </ul>
  </Nav>
);
