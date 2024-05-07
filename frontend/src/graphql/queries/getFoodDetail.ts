import { gql } from '@apollo/client';

export const GET_FOOD_DETAIL = gql`
  query GetFoodDetail($foodName: String!) {
    getFoodDetail(foodName: $foodName) {
      food_name
      serving_qty
      serving_unit
      nf_calories
      nf_total_fat
      nf_saturated_fat
      nf_cholesterol
      nf_sodium
      nf_total_carbohydrate
      nf_dietary_fiber
      nf_sugars
      nf_protein
      nf_potassium
      nf_p
    }
  }
`;
