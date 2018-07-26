import React, { Fragment as F } from "react";
import styled from "styled-components";

const FailureBox = styled.div`
  color: red;
`;

const SuccessBox = styled.div`
  color: green;
`;

export default ({ error, children }) =>
  error ? (
    <FailureBox>{children}</FailureBox>
  ) : (
    <SuccessBox>{children}</SuccessBox>
  );
