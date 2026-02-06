import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('personalhealth.db');

export interface CustomFood {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving_size: string;
}

export const DatabaseService = {
    init: () => {
        try {
            db.execSync(`
                CREATE TABLE IF NOT EXISTS custom_foods (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    calories REAL NOT NULL,
                    protein REAL NOT NULL,
                    carbs REAL NOT NULL,
                    fat REAL NOT NULL,
                    serving_size TEXT NOT NULL
                );
            `);
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    },

    addCustomFood: (food: Omit<CustomFood, 'id'>) => {
        try {
            const { name, calories, protein, carbs, fat, serving_size } = food;
            db.runSync(
                'INSERT INTO custom_foods (name, calories, protein, carbs, fat, serving_size) VALUES (?, ?, ?, ?, ?, ?)',
                [name, calories, protein, carbs, fat, serving_size]
            );
            console.log('Custom food added:', name);
        } catch (error) {
            console.error('Failed to add custom food:', error);
            throw error;
        }
    },

    getCustomFoods: (): CustomFood[] => {
        try {
            const result = db.getAllSync<CustomFood>('SELECT * FROM custom_foods ORDER BY id DESC');
            return result;
        } catch (error) {
            console.error('Failed to get custom foods:', error);
            return [];
        }
    },

    deleteCustomFood: (id: number) => {
        try {
            db.runSync('DELETE FROM custom_foods WHERE id = ?', [id]);
            console.log('Custom food deleted:', id);
        } catch (error) {
            console.error('Failed to delete custom food:', error);
            throw error;
        }
    }
};
