import React, { Fragment as F } from "react";
import { Header, Footer, Nav, Content, Flex } from "./";
import { injectGlobal } from "styled-components";
import reset from "styled-reset";

//${reset}
injectGlobal`
  body {
    background-color: whitesmoke;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }
`;

export default ({ title, children, subnav }) => {
  return (
    <F>
      <Header>
        <Nav />
        <h1>{title}</h1>
      </Header>
      {subnav && (
        <Flex>
          <div>{subnav()}</div>
          <Content>{children}</Content>
        </Flex>
      )}
      {!subnav && <Content>{children}</Content>}
      <Footer />
    </F>
  );
};
