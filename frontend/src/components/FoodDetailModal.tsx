import React from 'react';
import { useMutation } from '@apollo/client';
import { Box, Modal, Typography, Button, CircularProgress } from '@mui/material';
import { ADD_FOOD_ENTRY } from '../graphql/mutations/addFoodEntry';
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries';
import { FoodEntry } from '../types/graphql';

// Types for the food details
type FoodDetail = {
    food_name: string;
    serving_qty: number | null;
    serving_unit: string | null;
    nf_calories: number | null;
    imageUrl?: string;
};

type FoodDetailModalProps = {
    open: boolean;
    handleClose: () => void;
    loading: boolean;
    foodDetail: FoodDetail | null;
};

interface FoodEntriesData {
    getFoodEntries: FoodEntry[];
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
    open,
    handleClose,
    loading,
    foodDetail,
}) => {
    

    const [addFoodEntry, { loading: adding, error }] = useMutation(ADD_FOOD_ENTRY, {
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
        },
        onCompleted: () => {
            // Perform any action after adding food entry here
            handleClose();
        },
        // ... include your update logic for cache as in the AddFoodEntryForm
    });
    





    const handleAddButtonClick = () => {
        if (foodDetail) {
            const { food_name, serving_qty, serving_unit, nf_calories } = foodDetail;

            // You might need to adjust the variables here to match the actual mutation requirements
            addFoodEntry({
                variables: {
                    description: `Serving: ${serving_qty} ${serving_unit} of ${food_name}`,
                    calories: parseInt((nf_calories || 0).toString()),
                },
            }).then(()=> {
                
            }).catch((err) => {
                console.log(err);
            });

            
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="food-detail-modal"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4 }}>
                {
                    loading ? (
                        <CircularProgress />
                    ) : (
                        foodDetail && (
                            <>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    {foodDetail.food_name}
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Serving Size: {foodDetail.serving_qty} {foodDetail.serving_unit}
                                </Typography>
                                <Typography>
                                    Calories: {foodDetail.nf_calories}
                                </Typography>
                                {foodDetail.imageUrl && <img src={foodDetail.imageUrl} alt={foodDetail.food_name} />}
                                <Button onClick={handleAddButtonClick}>ADD Food</Button>
                                <Button onClick={handleClose}>Close</Button>
                            </>
                        )
                    )
                }
            </Box>
        </Modal>
    );
};

export default FoodDetailModal;
