import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    Typography,
    Modal,
    Box,
    TextField
} from '@mui/material';
import { REMOVE_FOOD_ENTRY } from '../graphql/mutations/removeFoodEntry'; // Import your mutations
import { GET_FOOD_ENTRIES } from '../graphql/queries/getFoodEntries'; // This should be your query for fetching food entries
import { UPDATE_FOOD_ENTRY } from '../graphql/mutations/updateFoodEntry';
import Navbar from '../components/Navbar';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

// Define interfaces for your GraphQL types
interface FoodEntry {
    id: string;
    description: string;
    calories: number;
    eatenAt: string;
}

interface GetFoodEntriesResponse {
    getFoodEntries: FoodEntry[];
}

const AdminManagementPage: React.FC = () => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(20);

    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [currentEdit, setCurrentEdit] = useState<FoodEntry | null>(null);

    // Open the modal with the food entry data
    const handleEditClick = (entry: FoodEntry) => {
        setCurrentEdit(entry);
        setEditModalOpen(true);
    };

    // Close the modal and reset edit state
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setCurrentEdit(null);
    };


    const { loading, error, data } = useQuery<GetFoodEntriesResponse>(GET_FOOD_ENTRIES, {
        variables: { offset: page * rowsPerPage, limit: rowsPerPage },
    });

    const [removeFoodEntry] = useMutation(REMOVE_FOOD_ENTRY, {
        update(cache, { data: { removeFoodEntry } }) {
            cache.modify({
                fields: {
                    getFoodEntries(existingFoodEntriesRefs, { readField }) {
                        return existingFoodEntriesRefs.filter(
                            (foodEntryRef: any) => removeFoodEntry.id !== readField('id', foodEntryRef)
                        );
                    }
                }
            });
        }
    });

    const [editFoodEntry, { loading: updateLoading }] = useMutation(UPDATE_FOOD_ENTRY, {
        update(cache, { data: { updateFoodEntry } }) {
            cache.modify({
                fields: {
                    getFoodEntries(existingFoodEntriesRefs, { readField }) {
                        return existingFoodEntriesRefs.map(
                            (foodEntryRef: any) => {
                                if (updateFoodEntry.id === readField('id', foodEntryRef)) {
                                    return updateFoodEntry;
                                }
                            }
                        );
                    }
                }
            });
        }
    });

    // Handle the remove action
    const handleRemove = (id: string) => {
        removeFoodEntry({
            variables: { id },
        });
    };

    const hanldUpdate = (entry: FoodEntry) => {
        editFoodEntry({
            variables: {
                id: entry.id,
                description: entry.description,
                calories: entry.calories,
                eatenAt: entry.eatenAt
            }
        });
        setEditModalOpen(false);
    }


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <Navbar />
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }} style={{ marginTop: '2em' }}>
                Manage all Food Entries
            </Typography>
            <Paper>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>Calories</TableCell>
                                <TableCell>Eaten At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Populate table rows with the food entries data */}
                            {data?.getFoodEntries.map((entry: FoodEntry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell>{entry.calories}</TableCell>
                                    <TableCell>{new Date(parseInt(entry.eatenAt)).toDateString()}</TableCell>
                                    <TableCell align="right">
                                        {/* Replace with your edit functionality */}
                                        <Button onClick={() => handleRemove(entry.id)}>Remove</Button>
                                        <Button onClick={() => handleEditClick(entry)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={-1} // replace with your total count of entries
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </TableContainer>
                {/* Modal for editing a food entry */}
                <Modal
                    open={editModalOpen}
                    onClose={handleCloseEditModal}
                    aria-labelledby="edit-entry-modal"
                    aria-describedby="edit-entry-modal-description"
                >
                    <Box sx={style}>
                        <h2 id="edit-entry-modal">Edit Food Entry</h2>
                        {currentEdit ? (
                            // Your form inputs and labels would go here
                            <form>
                                {/* You would use currentEdit data to populate these fields */}
                                <TextField
                                    label="Description"
                                    defaultValue={currentEdit.description}
                                    fullWidth
                                    margin="normal"
                                    onChange={(e) => {
                                        // Only update if currentEdit is not null
                                        if (currentEdit) {
                                            // Use the Functional Update Form of setState
                                            setCurrentEdit({
                                                ...currentEdit, // Spread the other values
                                                description: e.target.value, // Update the description
                                            });
                                        }
                                    }}
                                />
                                <TextField
                                    label="Calories"
                                    defaultValue={currentEdit.calories}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    onChange={(e) => {
                                        // Only update if currentEdit is not null
                                        if (currentEdit) {
                                            // Use the Functional Update Form of setState
                                            setCurrentEdit({
                                                ...currentEdit, // Spread the other values
                                                calories: parseInt(e.target.value), // Update the description
                                            });
                                        }
                                    }}
                                />
                                {/* More inputs as needed */}
                                <Button variant="contained" color="primary" onClick={() => hanldUpdate(currentEdit)}>
                                    Update
                                </Button>
                                <Button variant="contained" onClick={handleCloseEditModal} style={{ marginLeft: '1em' }}>
                                    Cancel
                                </Button>
                            </form>
                        ) : null}
                    </Box>
                </Modal>
            </Paper>
        </>
    );
};

export default AdminManagementPage;
