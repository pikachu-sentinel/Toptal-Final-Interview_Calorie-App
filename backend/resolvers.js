// resolvers.js
const FoodEntry = require('./FoodEntry');
const jwt = require('jsonwebtoken');
const User = require('./User');
const bcrypt = require('bcrypt');
const nutritionix = require("nutritionix-api");


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
    },
};

module.exports = resolvers;
