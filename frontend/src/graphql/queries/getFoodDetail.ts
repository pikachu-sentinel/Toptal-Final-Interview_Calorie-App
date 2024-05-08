import { gql } from '@apollo/client';

export const GET_FOOD_DETAIL = gql`
  query GetFoodDetail($foodName: String!) {
    getFoodDetail(foodName: $foodName) {
      food_name
      serving_qty
      serving_unit
      nf_calories
      imageUrl
    }
  }
`;
