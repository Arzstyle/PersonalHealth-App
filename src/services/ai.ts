import nutritionData from '../data/nutrition.json';
import Constants from 'expo-constants';

// Groq API Configuration from .env via app.config.js
const GROQ_API_KEY = Constants.expoConfig?.extra?.groqApiKey || '';
const GROQ_API_URL = Constants.expoConfig?.extra?.groqApiUrl || 'https://api.groq.com/openai/v1/chat/completions';

// Types
interface FoodItem {
    id: number;
    name: string;
    calories: number;
    proteins: number;
    fat: number;
    carbohydrate: number;
    image: string;
}

interface MealItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image?: string;
    portion: string;
}

interface MealPlan {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
}

// Curated list of common Indonesian foods (Jawa Barat style, gym-friendly)
const getCommonFoods = (): string => {
    const foods = nutritionData as FoodItem[];

    // Keywords for filtering common foods by category
    const karbohidrat = ['nasi', 'bubur', 'lontong', 'ketupat', 'mie', 'bihun', 'kwetiau', 'roti', 'singkong', 'ubi', 'kentang', 'jagung', 'oatmeal', 'havermut', 'sagu', 'talas'];
    const proteinHewani = ['ayam', 'telur', 'ikan', 'daging', 'sapi', 'udang', 'cumi', 'bebek', 'tuna', 'salmon', 'lele', 'gurame', 'bandeng', 'tongkol', 'patin', 'teri', 'pindang', 'ati', 'ampela', 'kerang'];
    const proteinNabati = ['tahu', 'tempe', 'oncom', 'kacang', 'edamame'];
    const sayuran = ['bayam', 'kangkung', 'sawi', 'brokoli', 'wortel', 'kacang panjang', 'terong', 'labu', 'timun', 'tomat', 'tauge', 'buncis', 'capcay', 'tumis', 'sayur', 'gado', 'pecel', 'urap', 'lalapan', 'pare', 'oyong', 'daun singkong', 'nangka'];
    const buah = ['pisang', 'apel', 'jeruk', 'pepaya', 'mangga', 'semangka', 'melon', 'anggur', 'alpukat', 'nanas', 'jambu', 'salak', 'pir', 'buah naga'];

    // Helper to find foods matching keywords, randomized to prevent repetition (e.g. "Anak Sapi")
    const findByKeywords = (keywords: string[], limit: number): FoodItem[] => {
        // Filter first
        const matched = foods.filter(f =>
            f.calories > 0 &&
            keywords.some(k => f.name.toLowerCase().includes(k)) &&
            // Exclude overly specific or weird items
            !f.name.toLowerCase().includes('anak sapi') &&
            !f.name.toLowerCase().includes('daging gemuk') &&
            !f.name.toLowerCase().includes('mentah')
        );

        // Shuffle and slice
        return matched.sort(() => 0.5 - Math.random()).slice(0, limit);
    };

    const karboList = findByKeywords(karbohidrat, 15);
    const proteinHewaniList = findByKeywords(proteinHewani, 20);
    const proteinNabatiList = findByKeywords(proteinNabati, 10);
    const sayurList = findByKeywords(sayuran, 15);
    const buahList = findByKeywords(buah, 12);

    const formatFood = (f: FoodItem) =>
        `  • ${f.name}: ${f.calories} kkal, P${f.proteins}g, K${f.carbohydrate}g, L${f.fat}g (per 100g)`;

    return `
=== KARBOHIDRAT (Sumber Energi Utama) ===
${karboList.map(formatFood).join('\n')}

=== PROTEIN HEWANI (Pembangun Otot) ===
${proteinHewaniList.map(formatFood).join('\n')}

=== PROTEIN NABATI (Alternatif Sehat) ===
${proteinNabatiList.map(formatFood).join('\n')}

=== SAYURAN (Serat & Vitamin) ===
${sayurList.map(formatFood).join('\n')}

=== BUAH-BUAHAN (Vitamin & Mineral) ===
${buahList.map(formatFood).join('\n')}
`;
};

// Find food in nutrition database
const findFoodInDatabase = (name: string): FoodItem | undefined => {
    const lowerName = name.toLowerCase().trim();
    const foods = nutritionData as FoodItem[];

    // Try exact match first
    let found = foods.find(f => f.name.toLowerCase() === lowerName);
    if (found) return found;

    // Try partial match
    found = foods.find(f =>
        f.name.toLowerCase().includes(lowerName) ||
        lowerName.includes(f.name.toLowerCase())
    );
    if (found) return found;

    // Try word match
    const words = lowerName.split(' ');
    return foods.find(f =>
        words.some(word => word.length > 3 && f.name.toLowerCase().includes(word))
    );
};

// Calculate total calories for a meal plan
const calculateTotalCalories = (plan: MealPlan): number => {
    const allMeals = [...plan.breakfast, ...plan.lunch, ...plan.dinner, ...plan.snack];
    return allMeals.reduce((sum, item) => sum + item.calories, 0);
};

// Generate Meal Plan using Groq AI
export const generateMealPlanAI = async (
    targetCalories: number,
    goal: 'low-cal' | 'standard' | 'bulking',
    samples: any[]
): Promise<MealPlan | null> => {

    console.log(`[AI] Generating meal plan for goal: ${goal}, target: ${targetCalories} kkal`);

    const goalInfo = {
        'low-cal': {
            desc: 'DIET RENDAH KALORI - defisit untuk penurunan berat badan',
            breakfast: Math.round(targetCalories * 0.25),
            lunch: Math.round(targetCalories * 0.35),
            dinner: Math.round(targetCalories * 0.30),
            snack: Math.round(targetCalories * 0.10)
        },
        'standard': {
            desc: 'MAINTENANCE - menjaga berat badan stabil',
            breakfast: Math.round(targetCalories * 0.25),
            lunch: Math.round(targetCalories * 0.35),
            dinner: Math.round(targetCalories * 0.30),
            snack: Math.round(targetCalories * 0.10)
        },
        'bulking': {
            desc: 'SURPLUS KALORI - untuk menambah massa otot',
            breakfast: Math.round(targetCalories * 0.25),
            lunch: Math.round(targetCalories * 0.35),
            dinner: Math.round(targetCalories * 0.30),
            snack: Math.round(targetCalories * 0.10)
        }
    };

    const info = goalInfo[goal];
    // Get randomized list of foods every time
    const foodDatabase = getCommonFoods();

    const systemPrompt = `Kamu adalah AI nutritionist profesional Indonesia (Jawa Barat). Tugasmu membuat meal plan HARIAN yang seimbang dan mencapai target kalori.

=== TARGET KALORI HARIAN: ${targetCalories} KKAL ===
Tujuan: ${info.desc}

DISTRIBUSI WAJIB:
• Sarapan: ~${info.breakfast} kkal
• Makan Siang: ~${info.lunch} kkal  
• Makan Malam: ~${info.dinner} kkal
• Camilan: ~${info.snack} kkal

ATURAN PENTING:
1. TOTAL HARUS = ${targetCalories} kkal (toleransi ±100)
2. Gunakan makanan dari DATABASE di bawah, tapi boleh divariasikan cara masaknya (misal: "Ayam Goreng", "Pepes Ikan", "Tumis Kangkung").
3. Hitung: kalori = (kalori per 100g) × (porsi_gram / 100)
4. SETIAP WAKTU MAKAN HARUS ADA KOMBINASI:
   - 1 Karbohidrat (Nasi/Kentang/dll)
   - 1 Protein (Ayam/Ikan/Telur/dll)
   - 1 Sayuran (Wajib ada!)
5. JANGAN ulangi makanan yang sama di meal berbeda!
6. Prioritaskan Masakan Indonesia Rumahan yang lezat.

DATABASE MAKANAN (Referensi Nutrisi):
${foodDatabase}

FORMAT OUTPUT (JSON ONLY, NO MARKDOWN):
{"breakfast":[{"name":"Nasi Merah","portion_gram":150,"calories":165,"protein":3,"carbs":35,"fat":1},{"name":"Pepes Ikan Mas","portion_gram":100,"calories":120,"protein":18,"carbs":2,"fat":4},{"name":"Lalapan Timun","portion_gram":50,"calories":10,"protein":0,"carbs":2,"fat":0}],"lunch":[...]}

INGAT: Variasi masakan (Karbo+Protein+Sayur), jangan diulang, dan TOTAL TEGAS = ${targetCalories} kkal!`;

    const userPrompt = `Buatkan meal plan seimbang untuk ${goal} dengan total ${targetCalories} kkal.

Target per waktu makan:
- Sarapan: ${info.breakfast} kkal (karbo + protein + sayur)
- Makan Siang: ${info.lunch} kkal (karbo + protein + sayur)
- Makan Malam: ${info.dinner} kkal (karbo + protein + sayur)
- Camilan: ${info.snack} kkal (buah/snack sehat)

Gunakan makanan Indonesia yang umum (nasi, ayam, ikan, tempe, sayuran hijau, dll). Jangan pakai makanan aneh. Pastikan bervariasi dan total tepat ${targetCalories} kkal.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7, // Higher temp for better variety
                max_tokens: 2500,
            }),
        });

        if (!response.ok) {
            console.error('[AI] Groq API Error:', response.status, response.statusText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error('[AI] No content in response');
            throw new Error('Empty AI response');
        }

        console.log('[AI] Raw response:', content.substring(0, 200));

        // Parse AI response
        let aiPlan;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                aiPlan = JSON.parse(jsonMatch[0]);
            } else {
                aiPlan = JSON.parse(content);
            }
        } catch (parseError) {
            console.error('[AI] Failed to parse response:', content);
            throw new Error('Invalid AI response format');
        }

        // Use AI-generated data directly (nutrition.json is reference only, not locked)
        const enrichMeals = (meals: any[]): MealItem[] => {
            if (!Array.isArray(meals)) return [];

            return meals.map(meal => {
                const portionGram = meal.portion_gram || 150;

                // Try to find image and macros from database
                const dbFood = findFoodInDatabase(meal.name);
                const imageUrl = dbFood?.image;

                // Calculate macros from DB if AI returns 0 or missing
                const portionMultiplier = portionGram / 100;

                let protein = meal.protein || 0;
                let carbs = meal.carbs || 0;
                let fat = meal.fat || 0;
                let calories = meal.calories || 0;

                // If AI missed macros but we have DB data, use DB data (reference)
                if ((protein === 0 || carbs === 0) && dbFood) {
                    protein = dbFood.proteins * portionMultiplier;
                    carbs = dbFood.carbohydrate * portionMultiplier;
                    fat = dbFood.fat * portionMultiplier;
                    // Keep AI calories if provided, otherwise calc from DB
                    if (calories === 0) calories = dbFood.calories * portionMultiplier;
                }

                // Use AI-generated values directly (not locked to database)
                return {
                    name: meal.name,
                    calories: Math.round(calories),
                    protein: Math.round(protein),
                    carbs: Math.round(carbs),
                    fat: Math.round(fat),
                    image: imageUrl, // Only image from database as bonus
                    portion: `${portionGram}g`
                };
            });
        };

        const result: MealPlan = {
            breakfast: enrichMeals(aiPlan.breakfast || []),
            lunch: enrichMeals(aiPlan.lunch || []),
            dinner: enrichMeals(aiPlan.dinner || []),
            snack: enrichMeals(aiPlan.snack || [])
        };

        const totalCal = calculateTotalCalories(result);
        console.log(`[AI] Generated plan total: ${totalCal} kkal (target: ${targetCalories})`);

        return result;

    } catch (error) {
        console.error('[AI] generateMealPlanAI error:', error);
        // Fallback to smart generator
        return generateSmartMealPlan(targetCalories, goal);
    }
};

// Smart fallback meal plan that actually hits calorie targets
const generateSmartMealPlan = (targetCalories: number, goal: string): MealPlan => {
    const foods = nutritionData as FoodItem[];

    // Calculate calorie distribution
    const breakfastTarget = Math.round(targetCalories * 0.25);
    const lunchTarget = Math.round(targetCalories * 0.35);
    const dinnerTarget = Math.round(targetCalories * 0.30);
    const snackTarget = Math.round(targetCalories * 0.10);

    // Filter useful foods and shuffle them
    const usefulFoods = foods.filter(f =>
        f.calories > 50 && f.calories < 400 &&
        !f.name.toLowerCase().includes('anak sapi') &&
        !f.name.toLowerCase().includes('mentah')
    ).sort(() => 0.5 - Math.random());

    // Helper to pick foods that add up to target calories
    const pickFoodsForTarget = (target: number, count: number): MealItem[] => {
        const result: MealItem[] = [];
        let remaining = target;

        for (let i = 0; i < count && remaining > 50; i++) {
            // Find food that fits remaining calories
            const targetForItem = Math.round(remaining / (count - i));

            // Pick a random food from useful list
            const bestFood = usefulFoods[Math.floor(Math.random() * Math.min(50, usefulFoods.length))];

            // Calculate portion to hit target calories
            const portionGram = Math.round((targetForItem / bestFood.calories) * 100);
            const actualPortion = Math.max(50, Math.min(portionGram, 300));
            const multiplier = actualPortion / 100;

            result.push({
                name: bestFood.name,
                calories: Math.round(bestFood.calories * multiplier),
                protein: Math.round(bestFood.proteins * multiplier),
                carbs: Math.round(bestFood.carbohydrate * multiplier),
                fat: Math.round(bestFood.fat * multiplier),
                image: bestFood.image,
                portion: `${actualPortion}g`
            });

            remaining -= Math.round(bestFood.calories * multiplier);
        }

        return result;
    };

    const result: MealPlan = {
        breakfast: pickFoodsForTarget(breakfastTarget, 3), // 3 items for variety
        lunch: pickFoodsForTarget(lunchTarget, 3),
        dinner: pickFoodsForTarget(dinnerTarget, 3),
        snack: pickFoodsForTarget(snackTarget, 1)
    };

    const totalCal = calculateTotalCalories(result);
    console.log(`[Fallback] Generated plan total: ${totalCal} kkal (target: ${targetCalories})`);

    return result;
};

// Generate AI Content (for food scanning)
export const generateAIContent = async (prompt: string): Promise<{ success: boolean; data: string; error?: string }> => {
    try {
        // Extract food name from prompt
        const foodMatch = prompt.match(/\"([^\"]+)\"/);
        const foodName = foodMatch ? foodMatch[1] : prompt.replace('Identify the food item:', '').trim();

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `Kamu adalah AI nutrition analyzer. Tugasmu mencari makanan berdasarkan keyword.

RULES:
1. Berikan 5-8 makanan yang cocok dengan keyword pencarian
2. Gunakan nama makanan yang PROPER dan NORMAL (contoh: "Nasi Putih", "Ayam Goreng", "Telur Rebus")
3. JANGAN gunakan nama aneh atau istilah asing
4. Semua nilai nutrisi per 100 gram

OUTPUT FORMAT (JSON ARRAY ONLY, NO MARKDOWN):
[{"name":"Nasi Putih","calories":175,"protein":3,"carbs":40,"fat":0.3},{"name":"Ayam Goreng","calories":260,"protein":27,"carbs":0,"fat":16}]`
                    },
                    { role: 'user', content: `Cari makanan dengan keyword: "${foodName}". Berikan hasil dalam JSON array.` }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '[]';

        // Try to extract JSON from response
        try {
            // Try to find JSON array in response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                // Validate it's valid JSON
                JSON.parse(jsonMatch[0]);
                return { success: true, data: jsonMatch[0] };
            }

            // Try parsing entire content
            JSON.parse(content);
            return { success: true, data: content };
        } catch (parseError) {
            console.error('[AI] Failed to parse response:', content);
            // Return empty array as fallback
            return { success: true, data: '[]' };
        }
    } catch (error: any) {
        console.error('[AI] generateAIContent error:', error);
        return { success: false, data: '[]', error: error.message };
    }
};

// Generate Exercise Plan (mock for now)
export const generateExercisePlanAI = async (
    targetCalories: number,
    goal: string,
    activityLevel: string,
    profile: any
): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        warm_up: [
            { name: "Jumping Jacks", sets: 2, reps: "60s", difficulty: 20, muscle: "Full Body" },
            { name: "Arm Circles", sets: 2, reps: "30s", difficulty: 10, muscle: "Shoulders" }
        ],
        main_workout: [
            { name: "Push Ups", sets: 3, reps: "12-15", difficulty: 60, muscle: "Chest" },
            { name: "Squats", sets: 4, reps: "15", difficulty: 50, muscle: "Legs" },
            { name: "Burpees", sets: 3, reps: "10", difficulty: 80, muscle: "Full Body" }
        ],
        cool_down: [
            { name: "Child's Pose", sets: 1, reps: "60s", difficulty: 10, muscle: "Back" }
        ]
    };
};
