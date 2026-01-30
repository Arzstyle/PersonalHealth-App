import { Brain, Activity, Target } from "lucide-react-native";

export const ONBOARDING_SLIDES = [
    {
        id: 1,
        icon: Brain,
        color: "text-ai-green",
        bg: "bg-ai-green/10",
        title: "AI Neural Analysis",
        desc: "Our engine scans your bio-markers to calculate the perfect metabolic baseline.",
        features: ["Biometric Scan", "Metabolic Baseline", "Neural Profiling"],
    },
    {
        id: 2,
        icon: Activity,
        color: "text-ai-green",
        bg: "bg-ai-green/10",
        title: "Adaptive Protocols",
        desc: "Workouts and meal plans that evolve in real-time as your body adapts.",
        features: [
            "Real-time Adjustments",
            "Progressive Overload",
            "Dynamic Nutrition",
        ],
    },
    {
        id: 3,
        icon: Target,
        color: "text-ai-green",
        bg: "bg-ai-green/10",
        title: "Precision Tracking",
        desc: "Visualize your evolution with military-grade data precision.",
        features: ["Goal Tracking", "Data Visualization", "Milestone Rewards"],
    },
];
