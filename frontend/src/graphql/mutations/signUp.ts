import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SignUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      value
    }
  }
`;
