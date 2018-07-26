import "cross-fetch/polyfill";

import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({ uri: "http://localhost:7000/graphql" });

export default ({ render }) => (
  <ApolloProvider client={client}>{render()}</ApolloProvider>
);
