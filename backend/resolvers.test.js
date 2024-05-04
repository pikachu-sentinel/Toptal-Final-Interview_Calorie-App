const mongoose = require('mongoose');
const FoodEntry = require('./FoodEntry');
const resolvers = require('./resolvers');

describe('getFoodEntries resolver', () => {
  let conn;
  let db;

  beforeAll(async () => {
    conn = await mongoose.createConnection('mongodb://localhost:27017/test');
    db = conn.db;
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
    await conn.close();
  });

  it('should return an empty array when no food entries exist', async () => {
    const result = await resolvers.getFoodEntries();
    expect(result).toEqual([]);
  });

  it('should return all food entries', async () => {
    const foodEntries = [
      { description: 'Apple', calories: 95 },
      { description: 'Banana', calories: 105 },
    ];

    await FoodEntry.insertMany(foodEntries);

    const result = await resolvers.getFoodEntries();
    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ description: 'Apple', calories: 95 }),
        expect.objectContaining({ description: 'Banana', calories: 105 }),
      ]),
    );
  });
});
