// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const User = require('./User');  // Assuming you have a User model from adding authentication

const SECRET_KEY = 'your_secret_key';  // Ensure the secret key is stored securely, such as in an environment variable

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {  // Extract the user from JWT token and add it to the context
      const token = req.headers.authorization || '';
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        } catch (err) {
          console.log('Invalid or expired token');
        }
      }
      return { user };
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => 
    console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
  );
}

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  startServer();
}).catch(err => console.log(err));