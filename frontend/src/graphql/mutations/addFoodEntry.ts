import { gql } from '@apollo/client';

export const ADD_FOOD_ENTRY = gql`
  mutation AddFoodEntry($description: String!, $calories: Int!) {
    addFoodEntry(description: $description, calories: $calories) {
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
