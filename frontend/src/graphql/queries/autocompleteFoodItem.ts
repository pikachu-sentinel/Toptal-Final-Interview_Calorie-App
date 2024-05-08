import { gql } from '@apollo/client';

export const AUTOCOMPLETE_FOOD_ITEM = gql`
  query AutocompleteFoodItem($searchTerm: String!) {
    autocompleteFoodItem(searchTerm: $searchTerm) {
      name
      imageUrl
    }
  }
`;
