import { gql } from '@apollo/client';

export const REMOVE_FOOD_ENTRY = gql`
  mutation RemoveFoodEntry($id: ID!) {
    removeFoodEntry(id: $id) {
      id
    }
  }
`;
