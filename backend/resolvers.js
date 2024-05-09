// resolvers.js
const FoodEntry = require('./FoodEntry');
const jwt = require('jsonwebtoken');
const User = require('./User');
const bcrypt = require('bcrypt');
const nutritionix = require("nutritionix-api");
const nodemailer = require("nodemailer");
const Invitation = require('./Invitation');


const homepageURL = "https://xx.com/"

// Mock function to generate a token
function generateToken() {
    return require('crypto').randomBytes(16).toString('hex');
}

// Mock function to generate a temporary password
function generatePassword() {
    return require('crypto').randomBytes(8).toString('hex');
}

// Function to save the invitation to the database
const saveInvitation = async (email, token, password) => {
    const newInvitation = new Invitation({
        email,
        token,
        password,
        // createdAt and expiresAt are automatically set by the schema defaults
    });

    await newInvitation.save();
};

// Mock function to send invitation email
async function sendInvitationEmail(email, name, token, password) {
    // Use an email library like nodemailer and set up your transport and mail options here
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'email address',
            pass: 'email password', // Be cautious! It's unsafe to hardcode credentials
        },
    });

    const mailOptions = {
        from: 'email address',
        to: email,
        subject: `You're invited to use our app, ${name}!`,
        text: `Hello ${name}, you have been invited to join our app!\n\n` +
            `Please use the following token and password to complete your registration:\n\n` +
            `Token: ${token}\n` +
            `Password: ${password}\n\n` +
            `Link: ${homepageURL}registerfriend/?token="${token}"`+
            `If you did not request this, please ignore this email.`
    };

    await transporter.sendMail(mailOptions);
}


const SECRET_KEY = 'your_secret_key'; // This should be in an environment variable!
const YOUR_APP_ID = '7a2d26a3'; // Your APP ID
const YOUR_API_KEY = '4d5d83185a24e7d5e52a59706888a499'; // Your KEY

nutritionix.init(YOUR_APP_ID, YOUR_API_KEY);


const resolvers = {
    Query: {
        getFoodEntries: async (_, args, { user }) => {
            if (!user) throw new Error('Authentication required');
            return user.role === 'admin'
                ? await FoodEntry.find({}).populate('user')
                : await FoodEntry.find({ user: user.user }).populate('user');
        },
        getFoodDetail: async (_, { foodName }) => {
            try {
                // Fetch detailed information for the specified food item
                const result = await nutritionix.natural.search(foodName);

                // Extract relevant fields from the result
                const foodDetail = {
                    food_name: result.foods[0].food_name,
                    serving_qty: result.foods[0].serving_qty,
                    serving_unit: result.foods[0].serving_unit,
                    nf_calories: result.foods[0].nf_calories,
                    imageUrl: result.foods[0].photo?.thumb
                    // Add other relevant fields
                };

                return foodDetail;
            } catch (error) {
                console.error('Error fetching food detail:', error);
                throw new Error('Error fetching food detail');
            }
        },
        getDailyCalorieSum: async (_, { userId }) => {
            // Fetch all FoodEntry items for the given userId, typically from the database
            const foodEntries = await FoodEntry.find({ user: userId });

            // Calculate the calorie sum by grouping entries by date
            const calorieMap = foodEntries.reduce((acc, entry) => {
                const eatenAt = new Date(entry.eatenAt).toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
                if (!acc[eatenAt]) {
                    acc[eatenAt] = 0;
                }
                acc[eatenAt] += entry.calories;
                return acc;
            }, {});

            // Transform the calorieMap into an array of DailyCalorieSum objects
            return Object.entries(calorieMap).map(([date, totalCalories]) => ({
                date,
                totalCalories,
            }));
        },
        autocompleteFoodItem: async (_, { searchTerm }) => {
            if (!searchTerm) throw new Error('Search term is required');

            try {
                const result = await nutritionix.autocomplete.search(searchTerm)
                const foodSuggestions = result.common.map((commonfood) => ({
                    name: commonfood.food_name,
                    imageUrl: commonfood.photo?.thumb || '', // Use thumbnail image URL if available
                }));
                return foodSuggestions;
            }
            catch (error) {
                throw new Error('Error fetching autocomplete suggestions');
            }
        }
    },
    Mutation: {
        addFoodEntry: async (_, { description, calories }, { user }) => {
            if (!user) throw new Error('Authentication required');

            const newFoodEntry = new FoodEntry({ description, calories, user: user.user });
            await newFoodEntry.save();
            return newFoodEntry;
        },
        updateFoodEntry: async (_, { id, description, calories, eatenAt }, { user }) => {
            if (!user) throw new Error('Authentication required');

            const foodEntry = await FoodEntry.findById(id);

            if (!foodEntry || (foodEntry.user !== user.user && user.role !== 'admin')) {
                throw new Error('Unauthorized to update this food entry');
            }

            const update = { description, calories, eatenAt };
            // Clean up any undefined values that were not passed
            Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);
            update.user = user.user;

            // Find the food entry by ID and update it with the new values.
            // `new: true` option returns the updated object.
            const updatedFoodEntry = await FoodEntry.findByIdAndUpdate(id, update, { new: true });
            if (!updatedFoodEntry) {
                throw new Error('FoodEntry not found');
            }

            return updatedFoodEntry;
        },

        removeFoodEntry: async (_, { id }, { user }) => {
            if (!user) throw new Error('Authentication required.');

            const foodEntry = await FoodEntry.findById(id);

            // Check if entry exists and if the user is the owner or an admin.
            if (!foodEntry || (foodEntry.user !== user.id && user.role !== 'admin')) {
                throw new Error('Not authorized to delete this entry.');
            }
            await FoodEntry.deleteOne({ _id: id });
            return foodEntry;
        },

        signUp: async (_, { username, password }) => {
            const user = new User({ username, password });
            await user.save();
            const token = jwt.sign({ user: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            return { value: token };
        },
        signIn: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User does not exist');
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Incorrect password');
            }


            const token = jwt.sign({ user: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            return { value: token };
        },
        inviteFriend: async (_, { name, email }, context) => {
            const token = generateToken();
            const password = generatePassword();

            try {
                await saveInvitation(email, token, password);
                try {
                    await sendInvitationEmail(email, name, token, password);
                    return {
                        success: true,
                        message: `An invitation has been sent to ${email}!`,
                        // Omit the token and password in the GraphQL response for security
                    };
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    return {
                        success: false,
                        message: 'Failed to send invitation email.',
                    };
                }
            } catch (dbError) {
                console.error('Error saving to database:', dbError);
                return {
                    success: false,
                    message: 'Failed to save invitation details.',
                };
            }
        },
        registerFriend: async (_, { token, userDetails }) => {
            try {
                const invitation = await Invitation.findOne({ token });

                if (!invitation) {
                    throw new Error('Invitation does not exist or has already been used.');
                }

                // Check expiration
                if (new Date() > invitation.expiresAt) {
                    throw new Error('Invitation has expired.');
                }
                const { name, password } = userDetails;
                const user = new User({ name, password });
                await user.save();

                // Update the invitation to indicate it has been accepted
                invitation.accepted = true;
                await invitation.save();

                return {
                    success: true,
                    message: 'User registered successfully',
                    user: newUser // assuming newUser is an object with user information
                };
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Registration failed',
                    user: null
                };
            }
        }
    },
};

module.exports = resolvers;
