import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import { Layout, Flex } from "components-library";
import styled from "styled-components";
import { LikeIt } from "../components";

const Box = styled.div`
  border: 1px solid gray;
  margin: 20px;
  padding: 20px;
`;

const AllProducts = gql`
  query AllProducts {
    products {
      id
      price
      likes
      name
      category
      description
    }
  }
`;

export default () => {
  return (
    <Layout title="Products - App">
      <Query query={AllProducts}>
        {({ data: { products = [] } }) => (
          <Flex>
            {products.map(product => (
              <Box key={product.id}>
                <h1>{product.name}</h1>
                <ReactMarkdown source={product.description} />
                <div>{product.price}</div>
                <LikeIt forId={product.id}>{product.likes}</LikeIt>
              </Box>
            ))}
          </Flex>
        )}
      </Query>
    </Layout>
  );
};
