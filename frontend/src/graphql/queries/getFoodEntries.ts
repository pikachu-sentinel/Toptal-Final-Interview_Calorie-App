import { gql } from '@apollo/client';

export const GET_FOOD_ENTRIES = gql`
  query GetFoodEntries {
    getFoodEntries {
      id
      description
      calories
      eatenAt
      user {
        id
        username
        role
      }
    }
  }
`;
