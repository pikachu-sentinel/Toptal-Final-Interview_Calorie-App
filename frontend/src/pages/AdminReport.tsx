import React from 'react';
import { useQuery } from '@apollo/client';
import {
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
} from '@mui/material';
import { subDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries';
import { FoodEntry } from '../types/graphql';
import Navbar from '../components/Navbar'; // Update the import path if necessary

const AdminReport: React.FC = () => {
    const { isAuthenticated, role } = useAuth();
    const { loading, error, data } = useQuery<{ getFoodEntries: FoodEntry[] }>(GET_FOOD_ENTRIES);

    if (!isAuthenticated || role !== 'admin') {
        return <Typography variant="body1">Access denied.</Typography>;
    }

    if (loading) return <Typography>Loading report...</Typography>;
    if (error || !data) return <Typography>Error loading report.</Typography>;

    // Use 'date-fns' to calculate the date ranges
    const today = new Date();
    const oneWeekAgo = subDays(today, 7);
    const twoWeeksAgo = subDays(today, 14);

    const entriesLast7Days = data.getFoodEntries.filter((entry) => {
        const entryDate = new Date(parseInt(entry.eatenAt));
        return entryDate >= oneWeekAgo && entryDate < today;
    });

    const entriesPrev7Days = data.getFoodEntries.filter((entry) => {
        const entryDate = new Date(parseInt(entry.eatenAt));
        return entryDate >= twoWeeksAgo && entryDate < oneWeekAgo;
    });

    const averageCaloriesPerUser = entriesLast7Days.reduce((acc: { [username: string]: { totalCalories: number; count: number } }, entry) => {
        if (!acc[entry.user.username]) {
            acc[entry.user.username] = { totalCalories: 0, count: 0 };
        }
        acc[entry.user.username].totalCalories += entry.calories;
        acc[entry.user.username].count += 1;
        return acc;
    }, {});

    const avgCaloriesPerUser = Object.values(averageCaloriesPerUser).reduce((sum, { totalCalories, count }) => sum + (totalCalories / count), 0) / Object.values(averageCaloriesPerUser).length;
    const usersWithAvgCalories = Object.entries(averageCaloriesPerUser).map(([username, { totalCalories, count }]) => ({
        username,
        averageCalories: count === 0 ? 0 : totalCalories / count,
    }));

    // Update your component's return statement to include the Navbar and improved styles
    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom component="h1">
                    Simple Report
                </Typography>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant="subtitle1">
                        Number of added entries in the last 7 days: {entriesLast7Days.length}
                    </Typography>
                    <Typography variant="subtitle1">
                        Added entries the week before that: {entriesPrev7Days.length}
                    </Typography>
                    <Typography variant="subtitle1">
                        Average number of calories added per user for the previous 7 days: {isNaN(avgCaloriesPerUser) ? 'N/A' : avgCaloriesPerUser.toFixed(2)}
                    </Typography>
                </Paper>

                {/* Render the list of users with their average calorie intake */}
                <List sx={{ background: '#fff' }}>
                    {usersWithAvgCalories.map((user) => (
                        <React.Fragment key={user.username}>
                            <ListItem>
                                <ListItemText
                                    primary={user.username}
                                    secondary={`${user.averageCalories.toFixed(2)} average calories`}
                                />
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Container>
        </>
    );
};

export default AdminReport;
