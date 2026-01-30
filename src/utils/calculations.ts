// BMI Calculation
export const calculateBMI = (weight: number, height: number): number => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Number(bmi.toFixed(1));
};

// BMI Category
export const getBMICategory = (bmi: number): { label: string; color: string; category: string } => {
    if (bmi === 0) return { label: 'Unknown', color: '#64748b', category: 'Unknown' };
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6', category: 'Underweight' };
    if (bmi < 25) return { label: 'Normal Weight', color: '#10b981', category: 'Normal Weight' };
    if (bmi < 30) return { label: 'Overweight', color: '#eab308', category: 'Overweight' };
    return { label: 'Obese', color: '#ef4444', category: 'Obese' };
};

// BMR Calculation (Mifflin-St Jeor)
export const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: string
): number => {
    if (!weight || !height || !age) return 0;
    const s = gender === 'male' ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    return bmr;
};

// Ideal Weight Calculation
export const calculateIdealWeight = (height: number, gender: string): number => {
    if (!height) return 0;
    const base = height - 100;
    const adjustment = gender === 'male' ? 0.1 : 0.15;
    return Math.round(base - base * adjustment);
};

// TDEE / Daily Calories Calculation
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
    const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        athlete: 1.9,
        'very-active': 1.9,
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

// Full Daily Calories Calculation with Goal Adjustment
export const calculateDailyCalories = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    activityLevel: string,
    goal: string
): number => {
    const bmr = calculateBMR(weight, height, age, gender);
    const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        'very-active': 1.9,
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
    let targetCalories = tdee;

    if (goal === 'lose' || goal === 'weight-loss') {
        targetCalories -= 500;
    } else if (goal === 'gain' || goal === 'weight-gain') {
        targetCalories += 500;
    } else if (goal === 'muscle-gain' || goal === 'build') {
        targetCalories += 300;
    }

    const minCalories = gender === 'male' ? 1500 : 1200;
    return Math.round(Math.max(targetCalories, minCalories));
};

// Macro Targets Calculation
export const calculateMacroTargets = (calories: number, goal: string, weight: number) => {
    const safeWeight = weight || 55;
    let pRatio = 1.4;
    let fRatio = 1.0;

    if (goal === 'lose' || goal === 'weight-loss') {
        pRatio = 2.1;
        fRatio = 0.8;
    } else if (goal === 'gain' || goal === 'weight-gain' || goal === 'build' || goal === 'muscle-gain') {
        pRatio = 1.9;
        fRatio = 1.0;
    } else {
        pRatio = 1.4;
        fRatio = 1.0;
    }

    const proteinGrams = Math.round(safeWeight * pRatio);
    const fatGrams = Math.round(safeWeight * fRatio);
    const proteinCal = proteinGrams * 4;
    const fatCal = fatGrams * 9;
    const remainingCal = calories - (proteinCal + fatCal);
    const carbGrams = Math.max(0, Math.round(remainingCal / 4));

    return {
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams,
    };
};
