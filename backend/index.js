const express = require('express');
const  { ApolloServer, gql } = require('apollo-server-express');

// Define GraphQL schema
const typeDefs = gql`
  type FoodEntry {
    id: ID!
    description: String!
    calories: Int!
    eatenAt: String!
  }

  type User {
    id: ID!
    email: String!
    name: String
  }

  type Query {
    foodEntries(userId: ID!): [FoodEntry!]!
    foodEntry(id: ID!): FoodEntry
    currentUser: User
  }

  type Mutation {
    createFoodEntry(description: String!, calories: Int!, eatenAt: String!): FoodEntry
    updateFoodEntry(id: ID!, description: String, calories: Int, eatenAt: String): FoodEntry
    deleteFoodEntry(id: ID!): FoodEntry
    signUp(email: String!, password: String!, name: String): User
    signIn(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

// Define resolvers (assuming you have some data source connection, e.g., a database)
const resolvers = {
  Query: {
    // We will just return empty arrays or null for now
    foodEntries: () => [],
    foodEntry: () => null,
    currentUser: () => null,
  },
  Mutation: {
    createFoodEntry: (_, { description, calories, eatenAt }) => {
      // In practice, you would create a food entry in the database here
      return { id: '1', description, calories, eatenAt };
    },
    updateFoodEntry: (_, { id, description, calories, eatenAt }) => {
      // Update the food entry in the database here
      return { id, description, calories, eatenAt };
    },
    deleteFoodEntry: (_, { id }) => {
      // Delete the food entry from the database here
      return { id };
    },
    signUp: (_, { email, password, name }) => {
      // Create a new user in the database here
      return { id: '1', email, name };
    },
    signIn: (_, { email, password }) => {
      // In a real app, you would authenticate the user here
      const token = 'fake-jwt-token';
      return {
        token,
        user: { id: '1', email, name: 'John Doe' },
      };
    },
  },
  // Other resolvers if necessary
};

// Create an express application and apollo server
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server and apply it to the express application
server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = 4000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`));
});
