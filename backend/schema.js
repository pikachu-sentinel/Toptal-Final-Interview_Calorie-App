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
    nf_total_fat: Float!
    nf_saturated_fat: Float!
    nf_cholesterol: Float!
    nf_sodium: Float!
    nf_total_carbohydrate: Float!
    nf_dietary_fiber: Float!
    nf_sugars: Float!
    nf_protein: Float!
    nf_potassium: Float!
    nf_p: Float!
  }


  type Token {
    value: String!
  }

  type Query {
    getFoodEntries: [FoodEntry]
    getFoodDetail(foodName: String!): FoodDetail
    autocompleteFoodItem(searchTerm: String!): [FoodSuggestion]
  }

  type Mutation {
    addFoodEntry(description: String!, calories: Int!): FoodEntry
    updateFoodEntry(id: ID!, description: String, calories: Int, eatenAt: String): FoodEntry
    removeFoodEntry(id: ID!): FoodEntry

    signUp(username: String!, password: String!): Token
    signIn(username: String!, password: String!): Token
  }
`;


module.exports = typeDefs;
