// resolvers.js
const FoodEntry = require('./FoodEntry');
const jwt = require('jsonwebtoken');
const User = require('./User');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_secret_key'; // This should be in an environment variable!

const resolvers = {
    Query: {
        getFoodEntries: async (_, args, { user }) => {
            if (!user) throw new Error('Authentication required');

            return user.role === 'admin'
                ? await FoodEntry.find({})
                : await FoodEntry.find({ userId: user.id });
        },
    },
    Mutation: {
        addFoodEntry: async (_, { description, calories }, { user }) => {
            if (!user) throw new Error('Authentication required');

            const newFoodEntry = new FoodEntry({ description, calories, userId: user.id });
            return await newFoodEntry.save();
        },
        updateFoodEntry: async (_, { id, description, calories, eatenAt }, { uesr }) => {
            if (!user) throw new Error('Authentication required');

            const foodEntry = await FoodEntry.findById(id);

            if (!foodEntry || (foodEntry.userId !== user.id && user.role !== 'admin')) {
                throw new Error('Unauthorized to update this food entry');
            }

            const update = { description, calories, eatenAt };
            // Clean up any undefined values that were not passed
            Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);
            update.userId = user.id;

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
            if (!foodEntry || (foodEntry.userId !== user.id && user.role !== 'admin')) {
                throw new Error('Not authorized to delete this entry.');
            }
            await FoodEntry.deleteOne({ _id: id });
            return foodEntry;
        },

        signUp: async (_, { username, password }) => {
            const user = new User({ username, password });
            await user.save();
            const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
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

            const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            return { value: token };
        },
    },
};

module.exports = resolvers;
