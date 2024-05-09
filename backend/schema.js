// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type FoodEntry {
    id: ID!
    description: String!
    calories: Int!
    eatenAt: String!
    user: User!
  }

  type FoodSuggestion {
    name: String!
    imageUrl: String!
  }

  type FoodDetail {
    food_name: String!
    serving_qty: Float!
    serving_unit: String!
    nf_calories: Float!
    imageUrl: String!
  }


  type Token {
    value: String!
  }

  type DailyCalorieSum {
    date: String!
    totalCalories: Int!
  }

  type InvitationResponse {
    success: Boolean!
    message: String!
    token: String
    password: String
  }
  
  type RegisterResponse {
    success: Boolean!
    message: String!
    user: User
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  
  type Query {
    getFoodEntries: [FoodEntry]
    getFoodDetail(foodName: String!): FoodDetail
    autocompleteFoodItem(searchTerm: String!): [FoodSuggestion]
    getDailyCalorieSum(userId: ID!): [DailyCalorieSum]
  }

  type Mutation {
    addFoodEntry(description: String!, calories: Int!): FoodEntry
    updateFoodEntry(id: ID!, description: String, calories: Int, eatenAt: String): FoodEntry
    removeFoodEntry(id: ID!): FoodEntry

    signUp(username: String!, password: String!): Token
    signIn(username: String!, password: String!): Token

    inviteFriend(name: String!, email: String!): InvitationResponse!
    registerFriend(token: String!, userDetails: UserInput!): RegisterResponse!
  }
`;


module.exports = typeDefs;