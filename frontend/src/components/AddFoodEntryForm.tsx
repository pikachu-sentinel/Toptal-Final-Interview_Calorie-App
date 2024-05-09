// src/components/AddFoodEntryForm.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import { ADD_FOOD_ENTRY } from '../graphql/mutations/addFoodEntry';
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries';
import { FoodEntry } from '../types/graphql';


// Define the types for the mutation variables and response
interface AddFoodEntryData {
    addFoodEntry: {
        id: string;
        description: string;
        calories: number;
        eatenAt: string;
    };
}

interface AddFoodEntryVars {
    description: string;
    calories: number;
}

interface FoodEntriesData {
    getFoodEntries: FoodEntry[];
}

interface AddFoodEntryFormProps {
    onClose: () => void; // A callback for when the form needs to close
}

// AddFoodEntryForm component
const AddFoodEntryForm: React.FC<AddFoodEntryFormProps> = ({ onClose }) => {
    const [description, setDescription] = useState('');
    const [calories, setCalories] = useState('');

    // Apollo's useMutation hook with type parameters
    const [addFoodEntry, { data, loading, error }] = useMutation<AddFoodEntryData, AddFoodEntryVars>(
        ADD_FOOD_ENTRY, {
        update(cache, { data }) {
            if (data) {
                const existingEntries = cache.readQuery<FoodEntriesData>({ query: GET_FOOD_ENTRIES });
                const newFoodEntry = data.addFoodEntry;
                if (existingEntries && newFoodEntry) {
                    cache.writeQuery({
                        query: GET_FOOD_ENTRIES,
                        data: {
                            getFoodEntries: [...existingEntries.getFoodEntries, newFoodEntry],
                        },
                    });
                }
            }
        }
    });

    const handleAddFoodEntry = () => {
        // Parse calories as a number before sending in the mutation
        const parsedCalories = parseInt(calories, 10);
        if (!isNaN(parsedCalories)) {
            addFoodEntry({
                variables: {
                    description,
                    calories: parsedCalories,
                },
            }).then(() => {
                setDescription('');
                setCalories('');
            }).catch(() => {
                // Handle error
            })
            // Reset fields or notify user upon success
        }
    };

    // Error handling UI omitted for brevity

    return (
        <Box
            sx={{
                '& .MuiTextField-root': { m: 1 }, // Apply margin to all TextField components
            }}
            component="form"
            noValidate
            autoComplete="off"
        >

            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
                label="Calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
            />
            <Button onClick={handleAddFoodEntry} disabled={loading} variant="contained" style={{ margin: '8px', padding: '15px' }}>
                Add Food Entry
            </Button>
        </Box>
    );
};

export default AddFoodEntryForm;
