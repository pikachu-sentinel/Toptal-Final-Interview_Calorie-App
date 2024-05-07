import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Function to retrieve the auth token
const getAuthToken = () => localStorage.getItem('authToken');

// Set up a context link to include the auth token in request headers
const authLink: ApolloLink = setContext((_, { headers }) => {
  // Get the token from storage
  const token = getAuthToken();

  // Return the headers to the context, adding the Authorization header if the token is available
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint
});

// Combine authLink, errorLink and httpLink
const link: ApolloLink = ApolloLink.from([authLink, errorLink, httpLink]);

const cache = new InMemoryCache();

// Initialize Apollo Client with the links and cache
const client = new ApolloClient({
  link,
  cache,
  // other configuration options like headers, credentials etc.
});

export default client;
