// Assuming you have already set up Apollo Client and wrapped your app with ApolloProvider
import React from 'react';
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Navbar from '../components/Navbar';
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries'; // path to your query

const HomePage: React.FC = () => {
  // Execute the GET_FOOD_ENTRIES query and destructure the result
  const { loading, error, data } = useQuery(GET_FOOD_ENTRIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to FoodTracker
        </Typography>
        <Typography>
          Track your diet, monitor your progress, and achieve your health goals.
        </Typography>
        {/* Display list of food entries */}
        <List>
          {data.getFoodEntries.map((entry: any) => ( // Adjust the type as needed
            <ListItem key={entry.id}>
              <ListItemText
                primary={entry.description}
                secondary={`Calories: ${entry.calories} | Eaten At: ${new Date(entry.eatenAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default HomePage;
