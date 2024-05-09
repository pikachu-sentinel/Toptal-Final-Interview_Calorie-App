// src/pages/HomePage.tsx
import React from 'react';
import { Box, Card, CardContent, CardHeader, Container, Divider, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import AddFoodEntryForm from '../components/AddFoodEntryForm';
import AutocompleteInput from '../components/AutocompleteInput';
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries';
import { FoodEntry } from '../types/graphql';
import { useAuth } from '../context/AuthContext';
import { WarningOutlined } from '@mui/icons-material';
import AddFoodEntry from '../components/AddFoodEntry';

const calorieLimit = 2100;

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

function groupBy(entries: FoodEntry[], getKey: (entry: FoodEntry) => string) {
  return entries.reduce((accumulator, entry) => {
    const key = getKey(entry);
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(entry);
    return accumulator;
  }, {} as { [key: string]: FoodEntry[] });
}

type GroupedEntriesByUsername = { [username: string]: FoodEntry[] };

const HomePage: React.FC = () => {
  const { loading, error, data } = useQuery<FoodEntriesData>(GET_FOOD_ENTRIES);
  const { isAuthenticated, role } = useAuth();

  if (error) return <p>Error loading food entries...</p>;

  let entriesByUser: GroupedEntriesByUsername = {};
  if (data && isAuthenticated && role === 'admin') {
    // Group by username for admin
    entriesByUser = groupBy(data.getFoodEntries, (entry) =>
      entry.user.username
    );
  }

  // Style for cards meeting the calorie limit
  const cardStyle = {
    mb: 2,
    boxShadow: 2, // Apply some shadow for depth
  };

  // Style for headers with exceeded calorie limit
  const exceededCalorieHeaderStyle = {
    backgroundColor: '#d83b36', // A reddish background to indicate caution
    color: 'white',
    '& .MuiCardHeader-action': {
      color: 'yellow', // Set a color for the warning icon
    },
  };

  // Style for headers within the calorie limit
  const normalCalorieHeaderStyle = {
    backgroundColor: '#36d88e', // A greenish background to indicate good standing
    color: 'white',
  };


  // Group food entries by date and meal type
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

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={3} my={2}>
          {isAuthenticated && role === 'admin' && (
            <Typography gutterBottom variant="h5" component="div">
              Admin Dashboard
            </Typography>
          )}
          <Typography gutterBottom>
            Track your diet, monitor your progress, and achieve your health goals.
          </Typography>
          <AddFoodEntry />
        </Box>

        {loading ? (
          <Typography>Loading food entries...</Typography>
        ) : (
          isAuthenticated && role === 'admin' ? (
            // Admin view - Group by username
            Object.entries(entriesByUser).map(([username, entries]) => (
              <Card key={username} sx={{ mb: 2 }}>
                <CardHeader title={`Entries for ${username}`} sx={{ backgroundColor: '#f7f7f7' }} />
                <CardContent>
                  {entries.map((entry: FoodEntry) => (
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
            // Non-admin view or no food entries
            groupedEntries && Object.keys(groupedEntries).length > 0 ? (
              Object.keys(groupedEntries).sort().map((date) => (
                <Card key={date} sx={cardStyle}>
                  {
                    groupedEntries[date].totalCalories > calorieLimit &&
                    <CardHeader
                      title={`Entries for ${date}`}
                      subheader={`Total calories: ${groupedEntries[date].totalCalories}`}
                      sx={
                        groupedEntries[date].totalCalories > calorieLimit
                          ? exceededCalorieHeaderStyle
                          : normalCalorieHeaderStyle
                      }
                      action={
                        groupedEntries[date].totalCalories > calorieLimit ? <WarningOutlined /> : null
                      }
                    />
                  }
                  {
                    groupedEntries[date].totalCalories < calorieLimit &&
                    <CardHeader
                      title={`Entries for ${date}`}
                      subheader={`Total calories: ${groupedEntries[date].totalCalories}`}
                      sx={{ backgroundColor: '#36d88e', color: 'white' }}
                    />
                  }
                  <CardContent>
                    {groupedEntries[date].entries.map((entry, index, entriesArray) => {
                      const isLastEntry = index === entriesArray.length - 1; // Check if it's the last entry

                      return (
                        <React.Fragment key={entry.id}>
                          <Typography variant="body1">
                            {entry.description} - {getMealType(entry.eatenAt)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Calories: {entry.calories} - {format(new Date(parseInt(entry.eatenAt)), 'p')}
                          </Typography>
                          {isAuthenticated && role === 'admin' && (
                            <Typography variant="body2" color="textSecondary">
                              User: {entry.user.username}
                            </Typography>
                          )}
                          {/* Render Divider for all but the last entry */}
                          {!isLastEntry && <Divider sx={{ my: 1.5 }} />}
                        </React.Fragment>
                      );
                    })}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="subtitle1">No food entries found.</Typography>
            )
          )
        )}
      </Container>
    </>
  );
};

export default HomePage;
