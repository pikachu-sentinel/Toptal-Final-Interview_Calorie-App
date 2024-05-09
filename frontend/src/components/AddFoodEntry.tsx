// src/components/YourParentComponent.tsx
import React, { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import AddFoodEntryForm from './AddFoodEntryForm';
import { Dialog } from '@mui/material';

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
            <Dialog open={addingEntryManually} onClose={handleCloseDialog}>
                <AddFoodEntryForm onClose={() => handleCloseDialog} />
            </Dialog>
        </div>
    );
};

export default AddFoodEntry;
