import { gql } from '@apollo/client';

export const GET_DAILY_CALORIE_SUM = gql`
  query GetDailyCalorieSum($userId: ID!) {
    getDailyCalorieSum(userId: $userId) {
      date
      totalCalories
    }
  }
`;