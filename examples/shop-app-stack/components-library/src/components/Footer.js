import React from "react";
import styled from "styled-components";

const Footer = styled.footer`
  padding: 10px;
  width: 100%;
  background-color: lightgray;
  color: white;
`;

export default ({ children }) => (
  <Footer>
    <a href="/docs/imprint">Imprint</a> |{" "}
    <a href="/docs/data-protection">Data Protection</a>
    {children}
  </Footer>
);
