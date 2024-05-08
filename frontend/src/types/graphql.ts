export interface User {
    id: string;
    username: string;
    role: string;
}

export interface FoodEntry {
    id: string;
    description: string;
    calories: number;
    eatenAt: string;
    user: User;
}

export interface FoodSuggestion {
    name: string;
    imageUrl: string;
}

export interface FoodDetail {
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    nf_calories: number;
    imageUrl: string;
}

export interface Token {
    value: string;
}

// Query and Mutation Operation Result Types
export interface GetFoodEntriesResponse {
    getFoodEntries: FoodEntry[];
}

export interface GetFoodDetailResponse {
    getFoodDetail: FoodDetail;
}

export interface AutocompleteFoodItemResponse {
    autocompleteFoodItem: FoodSuggestion[];
}

export interface AddFoodEntryResponse {
    addFoodEntry: FoodEntry;
}

export interface UpdateFoodEntryResponse {
    updateFoodEntry: FoodEntry;
}

export interface RemoveFoodEntryResponse {
    removeFoodEntry: FoodEntry;
}

export interface SignUpResponse {
    signUp: Token;
}

export interface SignInResponse {
    signIn: Token;
}

// Query and Mutation Operation Variable Types
export interface GetFoodDetailVariables {
    foodName: string;
}

export interface AutocompleteFoodItemVariables {
    searchTerm: string;
}

export interface AddFoodEntryVariables {
    description: string;
    calories: number;
}

export interface UpdateFoodEntryVariables {
    id: string;
    description?: string; // Optional because it's nullable in GraphQL Schema
    calories?: number;    // Optional for the same reason
    eatenAt?: string;     // Optional for the same reason
}

export interface RemoveFoodEntryVariables {
    id: string;
}

export interface SignUpVariables {
    username: string;
    password: string;
}

export interface SignInVariables {
    username: string;
    password: string;
}
