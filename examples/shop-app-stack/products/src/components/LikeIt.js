import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const LikeIt = gql`
  mutation LikeIt($input: LikeItInput) {
    likeIt(input: $input) {
      error {
        message
      }
      product {
        id
        price
        likes
        name
        category
        description
      }
    }
  }
`;

export default ({ forId, children }) => (
  <Mutation mutation={LikeIt}>
    {(likeIt, { data, error, loading }) => {
      return (
        <div
          onClick={e => {
            likeIt({
              variables: {
                input: {
                  productId: forId
                }
              }
            });
          }}
        >
          ❤️{children}
        </div>
      );
    }}
  </Mutation>
);
