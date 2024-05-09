import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { REGISTER_FRIEND } from '../graphql/mutations/registerFriend';
import { Container, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';

// Define the user input type to match the GraphQL input type
interface UserInput {
  name: string;
  email: string;
  password: string;
}

const RegisterFriendPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserInput>({ name: '', email: '', password: '' });
  const [registerFriend, { loading, error }] = useMutation(REGISTER_FRIEND);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleInputChange = (name: keyof UserInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await registerFriend({ 
        variables: { 
          token, 
          userDetails
        }
      });
      
      if (response.data?.registerFriend.success) {
        // Registration was successful. Redirect or show a success message
        navigate('/home');
      } else {
        // Show an error message if the registration wasn't successful
        console.error(response.data?.registerFriend.message);
      }
    } catch (submitError) {
      console.error('Error registering friend:', submitError);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography variant="body1" color="error">An error occurred.</Typography>;

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        noValidate 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Register Friend
        </Typography>
          
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange('name')}
          required
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange('email')}
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={userDetails.password}
          onChange={handleInputChange('password')}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterFriendPage;
