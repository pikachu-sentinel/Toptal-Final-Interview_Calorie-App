import { gql } from '@apollo/client';

export const UPDATE_FOOD_ENTRY = gql`
  mutation UpdateFoodEntry($id: ID!, $description: String, $calories: Int, $eatenAt: String) {
    updateFoodEntry(id: $id, description: $description, calories: $calories, eatenAt: $eatenAt) {
      id
      description
      calories
      eatenAt
    }
  }
`;
