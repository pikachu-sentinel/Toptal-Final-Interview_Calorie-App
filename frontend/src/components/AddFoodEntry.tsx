import React, { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import AddFoodEntryForm from './AddFoodEntryForm';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const AddFoodEntry: React.FC = () => {
    const [addingEntryManually, setAddingEntryManually] = useState<boolean>(false);

    const handleAddManually = () => {
        setAddingEntryManually(true);
    };

    const handleCloseDialog = () => {
        setAddingEntryManually(false);
    };

    return (
        <div>
            <AutocompleteInput onAddManually={handleAddManually} />
            <Dialog
                open={addingEntryManually}
                onClose={handleCloseDialog}
                sx={{
                    '& .MuiDialog-paper': { // Target Dialog's inner paper component
                        borderRadius: 2, // Rounded corners for the paper
                        padding: 2, // Padding inside the paper
                        width: '100%', // Width of the dialog
                        maxWidth: '500px', // Maximum width of the dialog
                    },
                }}
            >
                <DialogTitle>{"Add Food Entry"}</DialogTitle>
                <DialogContent>
                    <AddFoodEntryForm onClose={handleCloseDialog} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddFoodEntry;
