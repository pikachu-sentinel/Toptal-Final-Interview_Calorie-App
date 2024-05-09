import { gql } from '@apollo/client';
// Define the GraphQL mutation
export const REGISTER_FRIEND = gql`
  mutation RegisterFriend($token: String!, $userDetails: UserInput!) {
    registerFriend(token: $token, userDetails: $userDetails) {
      success
      message
      user {
        id
        name
        email
      }
    }
  }
`;
