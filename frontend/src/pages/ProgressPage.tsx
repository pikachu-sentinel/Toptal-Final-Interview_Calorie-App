// src/pages/ProgressPage.tsx
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GET_DAILY_CALORIE_SUM } from '../graphql/queries/getDailyCalorieSum';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { Typography } from '@mui/material';

const calorieThreshold = 2100;

interface DailyCalorieSum {
    date: string;
    totalCalories: number;
}

interface GetDailyCalorieSumResponse {
    getDailyCalorieSum: DailyCalorieSum[];
}

const ProgressPage: React.FC = () => {
    const { userid } = useAuth();
    console.log(userid);
    const { loading, error, data } = useQuery<GetDailyCalorieSumResponse>(GET_DAILY_CALORIE_SUM, {
        variables: { userId: userid },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>An error occurred: {error.message}</p>;

    return (
        <>
            <Navbar />
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }} style={{ marginTop: '2em' }}>
                Daily Sum of Calories
            </Typography>
            <ResponsiveContainer width="100%" height={400} style={{ marginTop: '2em' }}>
                <LineChart
                    data={data?.getDailyCalorieSum}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="totalCalories" stroke="#ff7300" yAxisId={0} />
                    <ReferenceLine
                        y={calorieThreshold}
                        label={`Calorie Goal: ${calorieThreshold}`}
                        stroke="red"
                        strokeDasharray="3 3"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>

    );
};

export default ProgressPage;
