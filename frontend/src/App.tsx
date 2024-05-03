import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

// Initialize Apollo Client with your GraphQL endpoint
const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

// Define TypeScript interfaces for your data
interface FoodEntry {
  id: string;
  description: string;
  calories: number;
  eatenAt: string;
}

interface FoodEntriesData {
  foodEntries: FoodEntry[];
}

interface FoodEntriesVars {
  userId: string;
}

// GraphQL query to fetch food entries
const GET_FOOD_ENTRIES = gql`
  query GetAllFoodEntries($userId: String!) {
    foodEntries(userId: $userId) {
      id
      description
      calories
      eatenAt
    }
  }
`;

const FoodEntries: React.FC<{ userId: string }> = ({ userId }) => {
  const { loading, error, data } = useQuery<FoodEntriesData, FoodEntriesVars>(GET_FOOD_ENTRIES, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.foodEntries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.description}</h3>
          <p>Calories: {entry.calories}</p>
          <p>Eaten on: {new Date(entry.eatenAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const userId = 'your-user-id'; // Replace with your actual user ID

  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My Food Entries</h2>
        <FoodEntries userId={userId} />
      </div>
    </ApolloProvider>
  );
};

export default App;
