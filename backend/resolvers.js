// resolvers.js
const FoodEntry = require('./FoodEntry');
const jwt = require('jsonwebtoken');
const User = require('./User');

const SECRET_KEY = 'your_secret_key'; // This should be in an environment variable!

const resolvers = {
    Query: {
        getFoodEntries: async () => {
            return await FoodEntry.find({});
        },
    },
    Mutation: {
        addFoodEntry: async (_, { description, calories }) => {
            const newFoodEntry = new FoodEntry({ description, calories });
            return await newFoodEntry.save();
        },
        updateFoodEntry: async (_, { id, description, calories, eatenAt }, context) => {
            if (!context.user) {
                throw new Error('Not Authenticated');
            }

            const update = {};
            if (description !== undefined) {
                update.description = description;
            }
            if (calories !== undefined) {
                update.calories = calories;
            }
            if (eatenAt !== undefined) {
                update.eatenAt = new Date(eatenAt);
            }

            // Find the food entry by ID and update it with the new values.
            // `new: true` option returns the updated object.
            const updatedFoodEntry = await FoodEntry.findByIdAndUpdate(id, update, { new: true });
            if (!updatedFoodEntry) {
                throw new Error('FoodEntry not found');
            }

            return updatedFoodEntry;
        },

        removeFoodEntry: async (_, { id }) => {
            return await FoodEntry.findByIdAndRemove(id);
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
