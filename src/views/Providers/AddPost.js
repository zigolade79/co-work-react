import React from "react";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

import { GET_POSTS } from "./PostsList";

const ADD_POST = gql`
  mutation($code: String!, $name: String!, $isOrg: Boolean!, $email: String) {
    addPost(code: $code, name: $name, isOrg: $isOrg, email: $email) {
      code
      name
      isOrg
      email
    }
  }
`;

const withAddPost = (Component) => (props) => {
  return (
    <Mutation mutation={ADD_POST}>
      {(addPost) => {
        return (
          <Component
            addPost={({ code, name, isOrg, email }) =>
              addPost({
                variables: { code, name, isOrg, email },
                refetchQueries: [{ query: GET_POSTS }],
              })
            }
          />
        );
      }}
    </Mutation>
  );
};

export default withAddPost;
