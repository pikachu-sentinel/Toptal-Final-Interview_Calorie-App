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

  type Token {
    value: String!
  }

  type Query {
    getFoodEntries: [FoodEntry]
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
