import React from "react";
import styled from "styled-components";

const Loading = styled.div`
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  position: fixed;
  background: rgba(220, 227, 236, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ({ children }) => (
  <Loading>
    <div>{children}</div>
  </Loading>
);
