// Example: TypeScript component in a React (with Material UI) project

import React from 'react';
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Navbar from '../components/Navbar';
import AddFoodEntryForm from '../components/AddFoodEntryForm';
import AutocompleteInput from '../components/AutocompleteInput';
import { format } from 'date-fns'; // Ensure date-fns is installed
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries';
import { FoodEntry } from '../types/graphql'; // Adjust the import to your GraphQL types location

interface FoodEntriesData {
  getFoodEntries: FoodEntry[];
}

// Helper function to determine meal type
function getMealType(eatenAt: string): string {
  const hour = new Date(parseInt(eatenAt)).getHours();
  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 16) return 'Lunch';
  if (hour >= 16 && hour < 22) return 'Dinner';
  return 'Snack';
}

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery<FoodEntriesData>(GET_FOOD_ENTRIES);

  if (error) return <p>Error loading food entries...</p>;

  // Group food entries by date and calculate the sum of calories for each group
  const groupedEntries = data?.getFoodEntries.reduce((acc: { [key: string]: { entries: FoodEntry[]; totalCalories: number } }, entry) => {
    const dateKey = new Date(parseInt(entry.eatenAt)).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = { entries: [], totalCalories: 0 };
    }
    acc[dateKey].entries.push(entry);
    acc[dateKey].totalCalories += Number(entry.calories); // Ensure entry.calories is converted to number
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>Welcome to Calorie App</Typography>
        <Typography>Track your diet, monitor your progress, and achieve your health goals.</Typography>
        <AutocompleteInput />
        <AddFoodEntryForm />
        {loading ? (
          <Typography>Loading food entries...</Typography>
        ) : (
          groupedEntries && Object.keys(groupedEntries).length > 0 ? (
            Object.keys(groupedEntries).sort().map((date) => (
              <Card key={date} sx={{ mb: 2 }}>
                <CardHeader
                  title={`Entries for ${date}`}
                  subheader={`Total calories: ${groupedEntries[date].totalCalories}`}
                  sx={{ backgroundColor: '#f7f7f7' }}
                />
                <CardContent>
                  {groupedEntries[date].entries.map((entry) => (
                    <React.Fragment key={entry.id}>
                      <Typography variant="body1">
                        {entry.description} - {getMealType(entry.eatenAt)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Calories: {entry.calories} - {format(new Date(parseInt(entry.eatenAt)), 'p')}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                    </React.Fragment>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="subtitle1">No food entries found.</Typography>
          )
        )}
      </Container>
    </>
  );
};

export default HomePage;
