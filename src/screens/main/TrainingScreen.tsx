import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
    Dumbbell,
    Home,
    Flame,
    Activity,
    ChevronLeft,
    ChevronRight,
    Play,
    Repeat,
    Zap,
    Trophy,
    Shield,
    Sword,
    Layers,
    Crosshair,
    X,
    Pause,
    CheckCircle,
} from "lucide-react-native";

// --- Data Constants ---

const HOME_CATEGORIES = [
    {
        id: "fullbody",
        title: "Full Body Spec-Ops",
        desc: "Latihan intensitas tempur untuk pembakaran kalori maksimal.",
        icon: Flame,
        color: "orange",
        exercises: [
            { id: "h1", name: "Jumping Jacks", sets: 3, reps: "45 sec", cal: 50, muscle: "Total Body", difficulty: 40 },
            { id: "h2", name: "Push Ups", sets: 3, reps: "12-15", cal: 30, muscle: "Chest Core", difficulty: 60 },
            { id: "h3", name: "Squats", sets: 4, reps: "20", cal: 40, muscle: "Legs Glutes", difficulty: 50 },
            { id: "h4", name: "Burpees", sets: 3, reps: "10", cal: 60, muscle: "Explosive", difficulty: 90 },
            { id: "h5", name: "Plank", sets: 3, reps: "60 sec", cal: 20, muscle: "Core Stabilizer", difficulty: 70 },
        ],
    },
    {
        id: "strength",
        title: "Core Stability Protocol",
        desc: "Bangun fondasi kekuatan otot dasar dengan gravitasi.",
        icon: Shield,
        color: "blue",
        exercises: [
            { id: "s1", name: "Lunges", sets: 3, reps: "12/side", cal: 40, muscle: "Legs", difficulty: 50 },
            { id: "s2", name: "Diamond Push Ups", sets: 3, reps: "8-12", cal: 35, muscle: "Triceps", difficulty: 75 },
            { id: "s3", name: "Glute Bridges", sets: 4, reps: "15", cal: 25, muscle: "Glutes", difficulty: 30 },
            { id: "s4", name: "Superman", sets: 3, reps: "15", cal: 20, muscle: "Lower Back", difficulty: 40 },
        ],
    },
    {
        id: "core",
        title: "Abs Armor Forge",
        desc: "Tempa otot perut sekeras baja dengan isolasi terpusat.",
        icon: Zap,
        color: "yellow",
        exercises: [
            { id: "c1", name: "Crunches", sets: 4, reps: "20", cal: 25, muscle: "Upper Abs", difficulty: 45 },
            { id: "c2", name: "Leg Raises", sets: 3, reps: "15", cal: 25, muscle: "Lower Abs", difficulty: 60 },
            { id: "c3", name: "Plank Variations", sets: 3, reps: "45 sec", cal: 30, muscle: "Core Stability", difficulty: 70 },
        ],
    },
];

const GYM_CATEGORIES = [
    {
        id: "push",
        title: "Push Mechanics",
        desc: "Sistem dorong mekanis: Dada, Bahu, dan Tricep.",
        icon: Sword,
        color: "red",
        exercises: [
            { id: "g1", name: "Bench Press", sets: 4, reps: "8-12", muscle: "Chest", difficulty: 80 },
            { id: "g2", name: "Overhead Press", sets: 3, reps: "10-12", muscle: "Shoulders", difficulty: 75 },
            { id: "g3", name: "Incline Press", sets: 3, reps: "10", muscle: "Upper Chest", difficulty: 70 },
            { id: "g4", name: "Tricep Pushdown", sets: 3, reps: "15", muscle: "Triceps", difficulty: 50 },
        ],
    },
    {
        id: "pull",
        title: "Pull Dynamics",
        desc: "Sistem tarik dinamis: Punggung dan Bicep.",
        icon: Layers,
        color: "cyan",
        exercises: [
            { id: "g5", name: "Lat Pulldown", sets: 4, reps: "10-12", muscle: "Lats", difficulty: 65 },
            { id: "g6", name: "Barbell Row", sets: 3, reps: "8-10", muscle: "Back Thickness", difficulty: 85 },
            { id: "g7", name: "Face Pulls", sets: 3, reps: "15", muscle: "Rear Delts", difficulty: 40 },
            { id: "g8", name: "Bicep Curls", sets: 3, reps: "12", muscle: "Biceps", difficulty: 50 },
        ],
    },
    {
        id: "legs",
        title: "Leg Hydraulics",
        desc: "Latihan kaki hidrolik untuk daya ledak bawah.",
        icon: Activity,
        color: "emerald",
        exercises: [
            { id: "g9", name: "Barbell Squat", sets: 4, reps: "6-10", muscle: "Quads & Glutes", difficulty: 95 },
            { id: "g10", name: "Romanian Deadlift", sets: 3, reps: "10-12", muscle: "Hamstrings", difficulty: 85 },
            { id: "g11", name: "Leg Press", sets: 3, reps: "12", muscle: "Legs", difficulty: 70 },
            { id: "g12", name: "Calf Raises", sets: 4, reps: "15-20", muscle: "Calves", difficulty: 30 },
        ],
    },
];

// --- Components ---

const WorkoutSessionOverlay = ({ exercise, onClose }: { exercise: any; onClose: () => void }) => {
    const [phase, setPhase] = useState<"countdown" | "active" | "rest">("countdown");
    const [countdown, setCountdown] = useState(3);
    const [timer, setTimer] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (phase === "countdown") {
            if (countdown > 0) {
                const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
                return () => clearTimeout(t);
            } else {
                setPhase("active");
            }
        }
    }, [countdown, phase]);

    useEffect(() => {
        let interval: any;
        if (phase === "active" && !isPaused) {
            interval = setInterval(() => setTimer((t) => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [phase, isPaused]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleFinishSet = () => {
        if (currentSet < exercise.sets) {
            setCurrentSet((c) => c + 1);
            setTimer(0);
        } else {
            onClose();
        }
    };

    return (
        <Modal animationType="slide" transparent={false} visible={true} onRequestClose={onClose}>
            <View className="flex-1 bg-[#020617] relative">
                <LinearGradient
                    colors={['#083344', '#020617', '#000000']}
                    locations={[0, 0.4, 1]}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />

                {/* Decorative Grid */}
                <View className="absolute inset-0 opacity-20 pointer-events-none">
                    <View className="absolute top-1/4 left-0 w-full h-[1px] bg-cyan-500/10" />
                    <View className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/10" />
                </View>

                <SafeAreaView className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
                        <View className="flex-row items-center gap-4">
                            <View className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/50">
                                <Activity size={24} color="#22d3ee" />
                            </View>
                            <View>
                                <Text className="text-xl font-black text-white">{exercise.name}</Text>
                                <Text className="text-xs text-cyan-400 font-bold tracking-widest">SESSION ACTIVE</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-slate-800">
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="flex-1 items-center justify-center p-6">
                        {phase === "countdown" && (
                            <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                                <Text className="text-[120px] font-black text-cyan-400">
                                    {countdown > 0 ? countdown : "GO!"}
                                </Text>
                            </View>
                        )}

                        {/* Exercise Illustration Placeholder */}
                        <View className="w-full aspect-square bg-slate-900/50 overflow-hidden mb-8 items-center justify-center shadow-2xl shadow-cyan-900/20" style={{ borderRadius: 40 }}>
                            <Image
                                source={{ uri: `https://placehold.co/600x600/0f172a/22d3ee?text=${encodeURIComponent(exercise.name)}` }}
                                className="w-full h-full opacity-80"
                                resizeMode="cover"
                            />
                            {/* Overlay UI */}
                            <View className="absolute top-6 left-6 w-6 h-6 border-l-2 border-t-2 border-cyan-400" />
                            <View className="absolute top-6 right-6 w-6 h-6 border-r-2 border-t-2 border-cyan-400" />
                            <View className="absolute bottom-6 left-6 w-6 h-6 border-l-2 border-b-2 border-cyan-400" />
                            <View className="absolute bottom-6 right-6 w-6 h-6 border-r-2 border-b-2 border-cyan-400" />
                        </View>

                        {/* Live Timer */}
                        <View className="bg-slate-900 border border-slate-800 p-6 w-full mb-6 items-center" style={{ borderRadius: 24 }}>
                            <Text className="text-xs text-cyan-500 font-bold tracking-[0.2em] uppercase mb-2">DURATION</Text>
                            <Text className="text-7xl font-black text-white font-mono tracking-tighter">{formatTime(timer)}</Text>
                        </View>

                        {/* Stats Grid */}
                        <View className="flex-row gap-4 w-full mb-8">
                            <View className="flex-1 bg-slate-900 border border-slate-800 p-4 items-center" style={{ borderRadius: 20 }}>
                                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">SET</Text>
                                <Text className="text-2xl font-black text-white">{currentSet} <Text className="text-sm font-bold text-slate-500">/ {exercise.sets}</Text></Text>
                            </View>
                            <View className="flex-1 bg-slate-900 border border-slate-800 p-4 items-center" style={{ borderRadius: 20 }}>
                                <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">TARGET</Text>
                                <Text className="text-2xl font-black text-white">{exercise.reps}</Text>
                            </View>
                        </View>

                        {/* Controls */}
                        <View className="flex-row gap-4 w-full">
                            <TouchableOpacity
                                onPress={() => setIsPaused(!isPaused)}
                                className={`flex-1 p-4 flex-row items-center justify-center gap-2 border ${isPaused ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-slate-800 border-white/10'}`}
                                style={{ borderRadius: 20 }}
                            >
                                {isPaused ? <Play size={20} color={isPaused ? '#eab308' : 'white'} /> : <Pause size={20} color="white" />}
                                <Text className={`font-bold ${isPaused ? 'text-yellow-400' : 'text-white'}`}>{isPaused ? "RESUME" : "PAUSE"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleFinishSet}
                                className="flex-1 p-4 flex-row items-center justify-center gap-2 bg-cyan-600 shadow-lg shadow-cyan-500/20"
                                style={{ borderRadius: 20 }}
                            >
                                <CheckCircle size={20} color="white" />
                                <Text className="font-bold text-white">{currentSet === exercise.sets ? "FINISH" : "NEXT SET"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export const TrainingScreen = () => {
    const [activeTab, setActiveTab] = useState<"home" | "gym">("home");
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [activeSessionExercise, setActiveSessionExercise] = useState<any | null>(null);

    const getCategoryStyle = (color: string) => {
        switch (color) {
            case 'orange': return { bg: 'bg-orange-900/20', border: 'border-orange-500/50', text: 'text-orange-400', icon: '#fb923c' };
            case 'blue': return { bg: 'bg-blue-900/20', border: 'border-blue-500/50', text: 'text-blue-400', icon: '#60a5fa' };
            case 'yellow': return { bg: 'bg-yellow-900/20', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: '#facc15' };
            case 'red': return { bg: 'bg-red-900/20', border: 'border-red-500/50', text: 'text-red-400', icon: '#f87171' };
            case 'cyan': return { bg: 'bg-cyan-900/20', border: 'border-cyan-500/50', text: 'text-cyan-400', icon: '#22d3ee' };
            case 'emerald': return { bg: 'bg-emerald-900/20', border: 'border-emerald-500/50', text: 'text-emerald-400', icon: '#34d399' };
            default: return { bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-400', icon: '#94a3b8' };
        }
    };

    const renderDashboard = () => {
        const data = activeTab === "home" ? HOME_CATEGORIES : GYM_CATEGORIES;

        return (
            <View className="gap-6 pb-20">
                {/* Categories */}
                <View>
                    <View className="flex-row items-center gap-3 mb-5">
                        <Crosshair size={20} color="#94a3b8" />
                        <Text className="text-white font-bold text-xl tracking-tight">Training Modules</Text>
                    </View>

                    <View className="gap-5">
                        {data.map((cat) => {
                            const style = getCategoryStyle(cat.color);
                            const IconC = cat.icon;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => setSelectedCategory(cat)}
                                    className={`bg-slate-900/50 border border-white/5 p-6`}
                                    style={{ borderRadius: 40 }} // Explicit Inline Style for Radius
                                >
                                    <View className="flex-row items-center gap-4 mb-4">
                                        <View className={`w-16 h-16 rounded-2xl items-center justify-center border ${style.bg} ${style.border}`}>
                                            <IconC size={28} color={style.icon} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-black text-xl leading-tight mb-1">{cat.title}</Text>
                                            <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{cat.exercises.length} PROTOCOLS</Text>
                                        </View>
                                        <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center self-start mt-2">
                                            <ChevronRight size={20} color="#64748b" />
                                        </View>
                                    </View>

                                    <Text className="text-slate-400 text-sm leading-relaxed mb-5 pl-1">{cat.desc}</Text>

                                    <View className="flex-row flex-wrap gap-2 pl-1">
                                        {cat.exercises.slice(0, 3).map((ex: any, i: number) => (
                                            <View key={i} className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <Text className="text-[10px] text-slate-300 font-bold">{ex.name}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        );
    };

    const renderDetailView = () => {
        if (!selectedCategory) return null;

        return (
            <View className="pb-20">
                <View className="flex-row items-center gap-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setSelectedCategory(null)}
                        className="w-12 h-12 rounded-2xl bg-slate-800 items-center justify-center border border-white/10"
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-black text-white">{selectedCategory.title}</Text>
                        <View className="flex-row items-center gap-3 mt-1">
                            <View className="px-2.5 py-1 rounded-md bg-cyan-900/30 border border-cyan-500/20">
                                <Text className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide">{activeTab === 'home' ? 'Home Ops' : 'Gym Ops'}</Text>
                            </View>
                            <Text className="text-xs text-slate-500 font-bold">{selectedCategory.exercises.length} Protocols Loaded</Text>
                        </View>
                    </View>
                </View>

                <View className="gap-6">
                    {selectedCategory.exercises.map((ex: any, idx: number) => (
                        <View key={ex.id} className="bg-slate-900/80 border border-white/10 overflow-hidden"
                            style={{ borderRadius: 40 }} // Explicit inline style
                        >
                            <View className="h-44 bg-slate-800/50 items-center justify-center relative">
                                {/* Grid BG */}
                                <View className="absolute inset-0 opacity-10">
                                    <View className="absolute top-0 left-0 w-full h-px bg-white" />
                                    <View className="absolute top-0 left-0 w-px h-full bg-white" />
                                </View>

                                <Dumbbell size={56} color="#334155" />
                                <Text className="text-slate-600 text-[10px] font-bold mt-3 uppercase tracking-widest opacity-60">Visual Data Preview</Text>

                                <View className="absolute top-5 left-5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/10 flex-row gap-2 items-center backdrop-blur-md">
                                    <Layers size={12} color="#3b82f6" />
                                    <Text className="text-xs font-bold text-white uppercase">{ex.sets} Sets</Text>
                                </View>

                                <View className="absolute bottom-0 w-full h-1 bg-slate-800">
                                    <View
                                        className={`h-full ${ex.difficulty > 60 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${ex.difficulty}%` }}
                                    />
                                </View>
                            </View>

                            <View className="p-7">
                                <View className="flex-row justify-between items-start mb-6">
                                    <Text className="text-xl font-black text-white flex-1 mr-4">{ex.name}</Text>
                                    <View className={`w-3 h-3 rounded-full ${ex.difficulty > 60 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-green-500 shadow-[0_0_8px_green]'}`} />
                                </View>

                                <View className="flex-row gap-3 mb-8">
                                    <View className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                                        <Text className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Reps</Text>
                                        <View className="flex-row gap-1.5 items-center">
                                            <Repeat size={16} color="#3b82f6" />
                                            <Text className="text-white font-bold text-sm">{ex.reps}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                                        <Text className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Muscle</Text>
                                        <View className="flex-row gap-1.5 items-center">
                                            <Activity size={16} color="#10b981" />
                                            <Text className="text-white font-bold text-xs" numberOfLines={1}>{ex.muscle}</Text>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setActiveSessionExercise(ex)}
                                    className="w-full bg-slate-950 border border-cyan-500/30 py-4.5 rounded-2xl flex-row items-center justify-center gap-2.5 active:bg-cyan-900/20 shadow-lg shadow-black/40"
                                >
                                    <Play size={18} color="#22d3ee" />
                                    <Text className="text-cyan-400 font-bold text-sm tracking-wide">START SESSION</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#02050a]" edges={['top']}>
            {activeSessionExercise && (
                <WorkoutSessionOverlay
                    exercise={activeSessionExercise}
                    onClose={() => setActiveSessionExercise(null)}
                />
            )}

            <View className="absolute inset-0 z-0">
                <LinearGradient
                    colors={['#0f172a', '#020617', '#000000']}
                    locations={[0, 0.4, 1]}
                    style={{ flex: 1 }}
                />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Header */}
                <View className="flex-row justify-between items-start mb-10">
                    <View>
                        <View className="flex-row items-center gap-3 mb-1.5 align-middle">
                            <View className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-lg" style={{ borderRadius: 12 }}>
                                <Trophy size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-2xl font-black text-white tracking-tight">Workout Protocol</Text>
                        </View>
                        <Text className="text-slate-500 text-xs font-bold mt-1 ml-1 flex-row items-center opacity-80">
                            <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                            Select Your Training Module
                        </Text>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-slate-900 p-2 border border-white/10 mb-8 shadow-inner" style={{ borderRadius: 99 }}>
                    <TouchableOpacity
                        onPress={() => { setActiveTab("home"); setSelectedCategory(null); }}
                        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-full transition-all ${activeTab === 'home' ? 'bg-cyan-600 shadow-md shadow-cyan-500/30' : ''}`}
                    >
                        <Home size={16} color={activeTab === 'home' ? 'white' : '#64748b'} />
                        <Text className={`font-bold text-xs ${activeTab === 'home' ? 'text-white' : 'text-slate-500'}`}>Home Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setActiveTab("gym"); setSelectedCategory(null); }}
                        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-full transition-all ${activeTab === 'gym' ? 'bg-cyan-600 shadow-md shadow-cyan-500/30' : ''}`}
                    >
                        <Dumbbell size={16} color={activeTab === 'gym' ? 'white' : '#64748b'} />
                        <Text className={`font-bold text-xs ${activeTab === 'gym' ? 'text-white' : 'text-slate-500'}`}>Gym Training</Text>
                    </TouchableOpacity>
                </View>

                {selectedCategory ? renderDetailView() : renderDashboard()}
            </ScrollView>
        </SafeAreaView>
    );
};
