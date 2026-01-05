import React, { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Label } from 'recharts'
import SubTabs from '../Common/SubTabs'
import './MedicalTab.css'

// Mock data for medical records
const vitalTrends = [
  { date: '12/16', heartRate: 72, bloodPressure: 120, weight: 165 },
  { date: '12/17', heartRate: 68, bloodPressure: 118, weight: 165 },
  { date: '12/18', heartRate: 75, bloodPressure: 122, weight: 164 },
  { date: '12/19', heartRate: 70, bloodPressure: 119, weight: 164 },
  { date: '12/20', heartRate: 73, bloodPressure: 121, weight: 163 },
  { date: '12/21', heartRate: 69, bloodPressure: 117, weight: 163 },
  { date: '12/22', heartRate: 71, bloodPressure: 120, weight: 162 },
]

const mockRecords = [
  { id: 1, type: 'Medication', date: '2024-12-22', description: 'Daily vitamin D', time: '08:00 AM' },
  { id: 2, type: 'Symptom', date: '2024-12-21', description: 'Mild headache', severity: 'Low' },
  { id: 3, type: 'Vital Signs', date: '2024-12-21', description: 'BP: 120/80, HR: 72' },
  { id: 4, type: 'Appointment', date: '2024-12-18', description: 'Annual checkup - All clear!' },
]

// Water intake data (glasses per day)
const mockWaterData = [
  { date: '12/17', glasses: 6, goal: 8 },
  { date: '12/18', glasses: 7, goal: 8 },
  { date: '12/19', glasses: 8, goal: 8 },
  { date: '12/20', glasses: 5, goal: 8 },
  { date: '12/21', glasses: 9, goal: 8 },
  { date: '12/22', glasses: 7, goal: 8 },
  { date: '12/23', glasses: 4, goal: 8 },
]

// Weight tracking data (all 13 metrics from Etekcity ESF-551)
const mockWeightData = [
  {
    date: '12/16',
    weight: 165,
    bmi: 24.5,
    bodyFat: 22.3,
    visceralFat: 8,
    subcutaneousFat: 18.5,
    metabolicAge: 32,
    bodyWater: 58.2,
    skeletalMuscle: 42.1,
    boneMass: 6.8,
    protein: 18.5,
    fatFreeBodyWeight: 128.2,
    muscleMass: 121.4,
    bmr: 1680
  },
  {
    date: '12/17',
    weight: 165,
    bmi: 24.5,
    bodyFat: 22.2,
    visceralFat: 8,
    subcutaneousFat: 18.4,
    metabolicAge: 32,
    bodyWater: 58.3,
    skeletalMuscle: 42.2,
    boneMass: 6.8,
    protein: 18.6,
    fatFreeBodyWeight: 128.3,
    muscleMass: 121.5,
    bmr: 1680
  },
  {
    date: '12/18',
    weight: 164,
    bmi: 24.4,
    bodyFat: 22.0,
    visceralFat: 7,
    subcutaneousFat: 18.2,
    metabolicAge: 31,
    bodyWater: 58.5,
    skeletalMuscle: 42.3,
    boneMass: 6.8,
    protein: 18.7,
    fatFreeBodyWeight: 127.9,
    muscleMass: 121.1,
    bmr: 1675
  },
  {
    date: '12/19',
    weight: 164,
    bmi: 24.4,
    bodyFat: 21.9,
    visceralFat: 7,
    subcutaneousFat: 18.1,
    metabolicAge: 31,
    bodyWater: 58.6,
    skeletalMuscle: 42.4,
    boneMass: 6.8,
    protein: 18.8,
    fatFreeBodyWeight: 128.0,
    muscleMass: 121.2,
    bmr: 1675
  },
  {
    date: '12/20',
    weight: 163,
    bmi: 24.2,
    bodyFat: 21.7,
    visceralFat: 7,
    subcutaneousFat: 17.9,
    metabolicAge: 30,
    bodyWater: 58.8,
    skeletalMuscle: 42.5,
    boneMass: 6.8,
    protein: 18.9,
    fatFreeBodyWeight: 127.6,
    muscleMass: 120.8,
    bmr: 1670
  },
  {
    date: '12/21',
    weight: 163,
    bmi: 24.2,
    bodyFat: 21.6,
    visceralFat: 7,
    subcutaneousFat: 17.8,
    metabolicAge: 30,
    bodyWater: 58.9,
    skeletalMuscle: 42.6,
    boneMass: 6.8,
    protein: 19.0,
    fatFreeBodyWeight: 127.7,
    muscleMass: 120.9,
    bmr: 1670
  },
  {
    date: '12/22',
    weight: 162,
    bmi: 24.1,
    bodyFat: 21.4,
    visceralFat: 6,
    subcutaneousFat: 17.6,
    metabolicAge: 29,
    bodyWater: 59.1,
    skeletalMuscle: 42.8,
    boneMass: 6.8,
    protein: 19.1,
    fatFreeBodyWeight: 127.3,
    muscleMass: 120.5,
    bmr: 1665
  },
  {
    date: '12/23',
    weight: 162,
    bmi: 24.1,
    bodyFat: 21.3,
    visceralFat: 6,
    subcutaneousFat: 17.5,
    metabolicAge: 29,
    bodyWater: 59.2,
    skeletalMuscle: 42.9,
    boneMass: 6.8,
    protein: 19.2,
    fatFreeBodyWeight: 127.4,
    muscleMass: 120.6,
    bmr: 1665
  },
  {
    date: '01/02', // This week (week starts Sunday 12/29)
    weight: 161,
    bmi: 23.9,
    bodyFat: 21.1,
    visceralFat: 6,
    subcutaneousFat: 17.3,
    metabolicAge: 29,
    bodyWater: 59.4,
    skeletalMuscle: 43.1,
    boneMass: 6.8,
    protein: 19.3,
    fatFreeBodyWeight: 127.1,
    muscleMass: 120.3,
    bmr: 1660
  },
]

// Exercise Programs - Week Templates
const mockProgramTemplates = [
  {
    id: 1,
    name: 'Strength Builder',
    totalWeeks: 12,
    weekTemplates: [
      {
        templateId: 'A',
        templateName: 'Week A - Foundation',
        days: [
          { day: 1, workoutName: 'Upper Body 1', exercises: [
            { name: 'Bench Press', sets: 3, reps: 10 },
            { name: 'Rows', sets: 3, reps: 10 },
            { name: 'Shoulder Press', sets: 3, reps: 8 }
          ]},
          { day: 2, workoutName: 'Lower Body 1', exercises: [
            { name: 'Squats', sets: 3, reps: 12 },
            { name: 'Deadlifts', sets: 3, reps: 8 },
            { name: 'Lunges', sets: 3, reps: 10 }
          ]},
          { day: 3, workoutName: null, exercises: [] }, // Rest
          { day: 4, workoutName: 'Upper Body 2', exercises: [
            { name: 'Incline Press', sets: 3, reps: 10 },
            { name: 'Pull-ups', sets: 3, reps: 8 },
            { name: 'Lateral Raises', sets: 3, reps: 12 }
          ]},
          { day: 5, workoutName: 'Lower Body 2', exercises: [
            { name: 'Front Squats', sets: 3, reps: 10 },
            { name: 'Romanian Deadlifts', sets: 3, reps: 10 },
            { name: 'Calf Raises', sets: 3, reps: 15 }
          ]},
          { day: 6, workoutName: null, exercises: [] }, // Rest
          { day: 7, workoutName: null, exercises: [] }  // Rest
        ]
      },
      {
        templateId: 'B',
        templateName: 'Week B - Intensity',
        days: [
          { day: 1, workoutName: 'Upper Body 1', exercises: [
            { name: 'Bench Press', sets: 4, reps: 8 },
            { name: 'Rows', sets: 4, reps: 8 },
            { name: 'Shoulder Press', sets: 4, reps: 6 }
          ]},
          { day: 2, workoutName: 'Lower Body 1', exercises: [
            { name: 'Squats', sets: 4, reps: 10 },
            { name: 'Deadlifts', sets: 4, reps: 6 },
            { name: 'Lunges', sets: 4, reps: 8 }
          ]},
          { day: 3, workoutName: null, exercises: [] },
          { day: 4, workoutName: 'Upper Body 2', exercises: [
            { name: 'Incline Press', sets: 4, reps: 8 },
            { name: 'Pull-ups', sets: 4, reps: 6 },
            { name: 'Lateral Raises', sets: 4, reps: 10 }
          ]},
          { day: 5, workoutName: 'Lower Body 2', exercises: [
            { name: 'Front Squats', sets: 4, reps: 8 },
            { name: 'Romanian Deadlifts', sets: 4, reps: 8 },
            { name: 'Calf Raises', sets: 4, reps: 12 }
          ]},
          { day: 6, workoutName: null, exercises: [] },
          { day: 7, workoutName: null, exercises: [] }
        ]
      }
    ],
    weekAssignments: ['A', 'A', 'A', 'B', 'B', 'B', 'A', 'A', 'A', 'B', 'B', 'B']
  },
  {
    id: 2,
    name: 'Morning Yoga Flow',
    totalWeeks: 8,
    weekTemplates: [
      {
        templateId: 'A',
        templateName: 'Week A - Basics',
        days: [
          { day: 1, workoutName: 'Gentle Flow', exercises: [{ name: 'Yoga Flow', sets: 1, reps: '30 min' }]},
          { day: 2, workoutName: null, exercises: [] },
          { day: 3, workoutName: 'Gentle Flow', exercises: [{ name: 'Yoga Flow', sets: 1, reps: '30 min' }]},
          { day: 4, workoutName: null, exercises: [] },
          { day: 5, workoutName: 'Gentle Flow', exercises: [{ name: 'Yoga Flow', sets: 1, reps: '30 min' }]},
          { day: 6, workoutName: null, exercises: [] },
          { day: 7, workoutName: null, exercises: [] }
        ]
      }
    ],
    weekAssignments: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A']
  }
]

// Loaded Programs (programs assigned to calendar)
const mockLoadedPrograms = [
  {
    id: 1,
    programId: 1,
    programName: 'Strength Builder',
    startDate: '2024-12-16', // Started 1 week ago
    timeSlot: 'morning',
    totalWeeks: 12
  },
  {
    id: 2,
    programId: 2,
    programName: 'Morning Yoga Flow',
    startDate: '2024-12-16',
    timeSlot: 'evening',
    totalWeeks: 8
  }
]

// Today's workouts (December 24, 2024)
const todayWorkouts = {
  morning: {
    workoutName: 'Lower Body 2',
    completed: false,
    exercises: [
      { name: 'Front Squats', sets: 3, reps: 10, completed: false },
      { name: 'Romanian Deadlifts', sets: 3, reps: 10, completed: false },
      { name: 'Calf Raises', sets: 3, reps: 15, completed: true }
    ]
  },
  evening: {
    workoutName: 'Gentle Flow',
    completed: false,
    exercises: [
      { name: 'Yoga Flow', sets: 1, reps: '30 min', completed: false }
    ]
  }
}

// Nutrition/Meals data - Comprehensive
// Pinned recipes (temporary, from web)
const mockPinnedRecipes = [
  {
    id: 1,
    title: 'One-Pan Lemon Garlic Chicken',
    description: 'Quick weeknight dinner with chicken thighs, potatoes, and green beans',
    url: 'https://www.pinterest.com/example1',
    image: 'https://via.placeholder.com/300x200/70C1B3/FFFFFF?text=Lemon+Chicken',
    source: 'Pinterest'
  },
  {
    id: 2,
    title: 'Asian Beef Stir Fry',
    description: 'Tender beef with colorful vegetables in savory sauce',
    url: 'https://www.budgetbytes.com/example2',
    image: 'https://via.placeholder.com/300x200/5B9BD5/FFFFFF?text=Beef+Stir+Fry',
    source: 'Budget Bytes'
  },
  {
    id: 3,
    title: 'Mediterranean Quinoa Bowl',
    description: 'Healthy grain bowl with chickpeas, cucumber, tomatoes, and feta',
    url: 'https://www.cookingclassy.com/example3',
    image: 'https://via.placeholder.com/300x200/FFA94D/FFFFFF?text=Quinoa+Bowl',
    source: 'Cooking Classy'
  }
]

// Saved recipes (from Obsidian vault)
const mockSavedRecipes = [
  {
    id: 1,
    title: 'Honey Garlic Salmon',
    tags: ['seafood', 'dinner', 'quick'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    calories: 420,
    protein: 35,
    carbs: 28,
    fat: 18,
    effort: 'easy',
    ingredients: ['salmon', 'honey', 'garlic', 'soy sauce', 'rice'],
    rating: 5,
    image: 'https://via.placeholder.com/300x200/70C1B3/FFFFFF?text=Salmon'
  },
  {
    id: 2,
    title: 'Slow Cooker Beef Stew',
    tags: ['beef', 'dinner', 'comfort-food'],
    prepTime: 20,
    cookTime: 480,
    servings: 6,
    calories: 380,
    protein: 32,
    carbs: 35,
    fat: 12,
    effort: 'medium',
    ingredients: ['ground beef', 'potatoes', 'carrots', 'onion', 'beef broth'],
    rating: 4,
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Beef+Stew'
  },
  {
    id: 3,
    title: 'Grilled Chicken Caesar Salad',
    tags: ['chicken', 'salad', 'lunch'],
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    calories: 350,
    protein: 38,
    carbs: 18,
    fat: 15,
    effort: 'easy',
    ingredients: ['chicken breast', 'romaine', 'parmesan', 'caesar dressing'],
    rating: 5,
    image: 'https://via.placeholder.com/300x200/5B9BD5/FFFFFF?text=Caesar+Salad'
  },
  {
    id: 4,
    title: 'Spicy Thai Basil Chicken',
    tags: ['chicken', 'dinner', 'asian'],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    calories: 395,
    protein: 34,
    carbs: 42,
    fat: 10,
    effort: 'easy',
    ingredients: ['ground chicken', 'basil', 'chili', 'fish sauce', 'rice'],
    rating: 5,
    image: 'https://via.placeholder.com/300x200/FFA94D/FFFFFF?text=Thai+Chicken'
  },
  {
    id: 5,
    title: 'Baked Lemon Herb Salmon',
    tags: ['seafood', 'dinner', 'healthy'],
    prepTime: 5,
    cookTime: 20,
    servings: 4,
    calories: 380,
    protein: 36,
    carbs: 8,
    fat: 22,
    effort: 'easy',
    ingredients: ['salmon', 'lemon', 'dill', 'olive oil'],
    rating: 4,
    image: 'https://via.placeholder.com/300x200/70C1B3/FFFFFF?text=Herb+Salmon'
  },
  {
    id: 6,
    title: 'Vegetarian Chili',
    tags: ['vegetarian', 'dinner', 'comfort-food'],
    prepTime: 15,
    cookTime: 45,
    servings: 8,
    calories: 280,
    protein: 15,
    carbs: 48,
    fat: 4,
    effort: 'medium',
    ingredients: ['beans', 'tomatoes', 'bell peppers', 'onion', 'chili powder'],
    rating: 4,
    image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Veggie+Chili'
  }
]

// Ingredients currently available
const mockCurrentIngredients = [
  { id: 1, name: 'Ground Beef', quantity: 'plenty', status: 'fresh' },
  { id: 2, name: 'Salmon', quantity: 'low', status: 'use-soon' },
  { id: 3, name: 'Fresh Spinach', quantity: 'plenty', status: 'use-soon' },
  { id: 4, name: 'Chicken Breast', quantity: 'medium', status: 'fresh' }
]

// Logged meals
const mockLoggedMeals = [
  {
    id: 1,
    date: '2026-01-03', // Today - breakfast logged
    mealType: 'breakfast',
    recipeName: 'Oatmeal with Berries',
    calories: 280,
    protein: 12,
    carbs: 48,
    fat: 6,
    servings: 1
  },
  {
    id: 2,
    date: '2026-01-03', // Today - lunch logged (2 of 3 meals = complete)
    mealType: 'lunch',
    recipeName: 'Turkey Sandwich',
    calories: 420,
    protein: 28,
    carbs: 45,
    fat: 12,
    servings: 1
  },
  {
    id: 3,
    date: '2024-12-28',
    mealType: 'breakfast',
    recipeName: 'Greek Yogurt Parfait',
    calories: 320,
    protein: 18,
    carbs: 42,
    fat: 8,
    servings: 1
  },
  {
    id: 4,
    date: '2024-12-28',
    mealType: 'lunch',
    recipeName: 'Grilled Chicken Caesar Salad',
    calories: 350,
    protein: 38,
    carbs: 18,
    fat: 15,
    servings: 1
  },
  {
    id: 5,
    date: '2024-12-27',
    mealType: 'dinner',
    recipeName: 'Honey Garlic Salmon',
    calories: 420,
    protein: 35,
    carbs: 28,
    fat: 18,
    servings: 1
  },
  {
    id: 6,
    date: '2024-12-27',
    mealType: 'lunch',
    recipeName: 'Spicy Thai Basil Chicken',
    calories: 395,
    protein: 34,
    carbs: 42,
    fat: 10,
    servings: 1
  }
]

// Daily macro goals
const mockMacroGoals = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 75
}

// Planned meals (next 2 weeks)
const mockPlannedMeals = [
  { id: 1, date: '2024-12-29', mealType: 'dinner', recipeName: 'Slow Cooker Beef Stew' },
  { id: 2, date: '2024-12-30', mealType: 'dinner', recipeName: 'Baked Lemon Herb Salmon' },
  { id: 3, date: '2025-01-01', mealType: 'dinner', recipeName: 'Vegetarian Chili' }
]

// Recipe recommendations (generated by algorithm)
const mockRecommendations = [
  {
    id: 1,
    recipe: mockSavedRecipes[1], // Beef Stew
    score: 95,
    reason: 'Uses ground beef (available). High protein to meet daily goal. Not eaten recently.'
  },
  {
    id: 2,
    recipe: mockSavedRecipes[4], // Baked Salmon
    score: 88,
    reason: 'Uses salmon (use soon!). Balanced macros. Quick preparation.'
  },
  {
    id: 3,
    recipe: mockSavedRecipes[3], // Thai Chicken
    score: 82,
    reason: 'Uses chicken (available). Adds variety (Asian cuisine). High rating.'
  }
]

// Sleep data
const mockSleepData = [
  { date: '12/17', hours: 7.5, quality: 'Good', bedtime: '11:00 PM', waketime: '6:30 AM' },
  { date: '12/18', hours: 6.8, quality: 'Fair', bedtime: '11:30 PM', waketime: '6:15 AM' },
  { date: '12/19', hours: 8.2, quality: 'Excellent', bedtime: '10:30 PM', waketime: '6:45 AM' },
  { date: '12/20', hours: 7.0, quality: 'Good', bedtime: '11:15 PM', waketime: '6:15 AM' },
  { date: '12/21', hours: 6.5, quality: 'Poor', bedtime: '12:00 AM', waketime: '6:30 AM' },
  { date: '12/22', hours: 7.8, quality: 'Good', bedtime: '10:45 PM', waketime: '6:30 AM' },
  { date: '12/23', hours: 7.2, quality: 'Good', bedtime: '11:00 PM', waketime: '6:15 AM' },
]

// Medications data - Comprehensive tracking
const mockMedications = [
  {
    id: 1,
    name: 'Lisinopril',
    type: 'prescribed',
    dosage: '10mg',
    schedule: 'regular',
    frequency: 'daily',
    timeSlots: ['morning'],
    doctor: 'Dr. Smith',
    pharmacy: 'CVS',
    notes: 'Take with food',
    active: true
  },
  {
    id: 2,
    name: 'Vitamin D',
    type: 'non-prescribed',
    dosage: '2000 IU',
    schedule: 'regular',
    frequency: 'daily',
    timeSlots: ['morning'],
    notes: '',
    active: true
  },
  {
    id: 3,
    name: 'Omega-3',
    type: 'non-prescribed',
    dosage: '1000mg',
    schedule: 'regular',
    frequency: 'daily',
    timeSlots: ['evening'],
    notes: '',
    active: true
  },
  {
    id: 4,
    name: 'Melatonin',
    type: 'non-prescribed',
    dosage: '3mg',
    schedule: 'regular',
    frequency: 'daily',
    timeSlots: ['night'],
    notes: 'For sleep',
    active: true
  },
  {
    id: 5,
    name: 'Tylenol',
    type: 'as-needed',
    dosage: '500mg',
    schedule: 'as-needed',
    instructions: 'For headaches/pain, max 4 times per day',
    active: true
  },
  {
    id: 6,
    name: 'Ibuprofen',
    type: 'as-needed',
    dosage: '200mg',
    schedule: 'as-needed',
    instructions: 'For inflammation/pain, max 3 times per day',
    active: true
  }
]

// Today's medication schedule (December 28, 2024)
const todayMedSchedule = {
  morning: [
    { medId: 1, name: 'Lisinopril', dosage: '10mg', taken: true, takenTime: '8:30 AM' },
    { medId: 2, name: 'Vitamin D', dosage: '2000 IU', taken: false, takenTime: null }
  ],
  evening: [
    { medId: 3, name: 'Omega-3', dosage: '1000mg', taken: false, takenTime: null }
  ],
  night: [
    { medId: 4, name: 'Melatonin', dosage: '3mg', taken: false, takenTime: null }
  ]
}

// As-needed medication log (today's doses)
const asNeededDosesLog = [
  {
    id: 1,
    medId: 5,
    name: 'Tylenol',
    dosage: '500mg',
    timestamp: '2024-12-28T14:30:00',
    notes: 'Headache'
  },
  {
    id: 2,
    medId: 5,
    name: 'Tylenol',
    dosage: '500mg',
    timestamp: '2024-12-28T18:15:00',
    notes: 'Headache persisted'
  }
]

// Medication adherence tracking data (status per day)
// 'met' = took all scheduled medications, 'partial' = took some but not all, 'unmet' = missed all/didn't take
const generateMedicationAdherence = () => {
  const adherenceData = []
  const today = new Date()

  // Generate 730 days (2 years) of data
  for (let i = 0; i < 730; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Realistic adherence pattern: mostly met, occasionally partial, rarely unmet
    const random = Math.random()
    let status
    if (random < 0.75) status = 'met'        // 75% met
    else if (random < 0.92) status = 'partial'  // 17% partial
    else status = 'unmet'                       // 8% unmet

    adherenceData.push({
      date: date.toISOString().split('T')[0],
      status
    })
  }

  return adherenceData
}

const medicationAdherenceHistory = generateMedicationAdherence()

// Health Events data
const mockHealthEvents = [
  {
    id: 1,
    date: '2024-12-15',
    description: 'Persistent numbness in left hand',
    severity: 'Moderate',
    duration: 'Ongoing',
    notes: 'Started after working long hours at desk. Worse in mornings.'
  },
  {
    id: 2,
    date: '2024-11-28',
    description: 'Migraine headache',
    severity: 'Severe',
    duration: 'Resolved',
    notes: 'Lasted 2 days. Triggered by stress and lack of sleep.'
  },
  {
    id: 3,
    date: '2024-10-10',
    description: 'Lower back pain',
    severity: 'Mild',
    duration: 'Resolved',
    notes: 'After heavy lifting. Resolved with rest and stretching.'
  },
]

// Mock data for reports (simplified versions)
const mockExerciseData = [
  { date: '12/23', type: 'Running', duration: 45, calories: 420 },
  { date: '12/22', type: 'Weight Training', duration: 60, calories: 280 },
  { date: '12/21', type: 'Yoga', duration: 30, calories: 120 },
  { date: '12/20', type: 'Running', duration: 40, calories: 380 },
  { date: '12/19', type: 'Swimming', duration: 50, calories: 450 },
]

const mockNutritionData = [
  { date: '2024-12-28', meal: 'Breakfast', description: 'Greek Yogurt Parfait', calories: 320, protein: 18 },
  { date: '2024-12-28', meal: 'Lunch', description: 'Grilled Chicken Caesar Salad', calories: 350, protein: 38 },
  { date: '2024-12-27', meal: 'Dinner', description: 'Honey Garlic Salmon', calories: 420, protein: 35 },
  { date: '2024-12-27', meal: 'Lunch', description: 'Spicy Thai Basil Chicken', calories: 395, protein: 34 },
]

// Sleep tracking data
const mockSleepEntries = [
  {
    id: 1,
    date: '2024-12-27',
    bedtime: '2024-12-27T23:30:00',
    wakeTime: '2024-12-28T07:00:00',
    totalSleepTime: 435, // minutes (7h 15m)
    totalTimeInBed: 450, // minutes (7h 30m)
    sleepEfficiency: 97, // calculated: (435/450)*100
    wakeUps: 2,
    quality: 4, // 0-5 scale
    deepSleepPercent: 28,
    lightSleepPercent: 52,
    remSleepPercent: 18,
    sleepCycles: 5,
    snoringMinutes: 12,
    noiseLevel: 23,
    medications: ['Melatonin 3mg at 10:30 PM'],
    exercise: 'Morning run, 6:00 AM, 45 minutes',
    caffeine: 'Coffee, 2 cups, 8:00 AM',
    alcohol: 'None',
    naps: 'None',
    notes: 'Felt well-rested. Room was comfortable.',
    source: 'sleep_app'
  },
  {
    id: 2,
    date: '2024-12-26',
    bedtime: '2024-12-26T22:45:00',
    wakeTime: '2024-12-27T06:30:00',
    totalSleepTime: 440,
    totalTimeInBed: 465,
    sleepEfficiency: 95,
    wakeUps: 1,
    quality: 5,
    deepSleepPercent: 32,
    lightSleepPercent: 48,
    remSleepPercent: 19,
    sleepCycles: 5,
    snoringMinutes: 8,
    noiseLevel: 18,
    medications: ['Melatonin 3mg at 10:00 PM'],
    exercise: 'None',
    caffeine: 'Coffee, 1 cup, 7:30 AM',
    alcohol: 'Wine, 1 glass, 7:00 PM',
    naps: 'None',
    notes: 'Excellent sleep. Woke up naturally.',
    source: 'sleep_app'
  },
  {
    id: 3,
    date: '2024-12-25',
    bedtime: '2024-12-25T23:00:00',
    wakeTime: '2024-12-26T08:00:00',
    totalSleepTime: 480,
    totalTimeInBed: 540,
    sleepEfficiency: 89,
    wakeUps: 3,
    quality: 3,
    deepSleepPercent: 24,
    lightSleepPercent: 55,
    remSleepPercent: 17,
    sleepCycles: 6,
    snoringMinutes: 25,
    noiseLevel: 31,
    medications: ['Melatonin 3mg at 10:30 PM'],
    exercise: 'Evening walk, 5:00 PM, 30 minutes',
    caffeine: 'Coffee, 3 cups throughout day',
    alcohol: 'Beer, 2 drinks, evening',
    naps: '2:00 PM, 45 minutes',
    notes: 'Holiday, stayed up late. Too much caffeine.',
    source: 'sleep_app'
  },
  {
    id: 4,
    date: '2024-12-24',
    bedtime: '2024-12-24T23:15:00',
    wakeTime: '2024-12-25T07:15:00',
    totalSleepTime: 420,
    totalTimeInBed: 480,
    sleepEfficiency: 88,
    wakeUps: 2,
    quality: 4,
    deepSleepPercent: 26,
    lightSleepPercent: 53,
    remSleepPercent: 19,
    sleepCycles: 5,
    snoringMinutes: 15,
    noiseLevel: 22,
    medications: ['Melatonin 3mg at 10:45 PM'],
    exercise: 'Morning workout, 6:30 AM, 40 minutes',
    caffeine: 'Coffee, 2 cups, morning',
    alcohol: 'None',
    naps: 'None',
    notes: 'Decent sleep, felt refreshed.',
    source: 'sleep_app'
  },
  {
    id: 5,
    date: '2024-12-23',
    bedtime: '2024-12-23T22:30:00',
    wakeTime: '2024-12-24T06:45:00',
    totalSleepTime: 465,
    totalTimeInBed: 495,
    sleepEfficiency: 94,
    wakeUps: 1,
    quality: 5,
    deepSleepPercent: 30,
    lightSleepPercent: 50,
    remSleepPercent: 19,
    sleepCycles: 6,
    snoringMinutes: 10,
    noiseLevel: 19,
    medications: ['Melatonin 3mg at 10:00 PM'],
    exercise: 'Evening yoga, 6:00 PM, 30 minutes',
    caffeine: 'Coffee, 1 cup, 8:00 AM; Tea, 1 cup, 2:00 PM',
    alcohol: 'None',
    naps: 'None',
    notes: 'Great sleep. Yoga before bed helped.',
    source: 'sleep_app'
  },
  {
    id: 6,
    date: '2024-12-22',
    bedtime: '2024-12-23T00:15:00',
    wakeTime: '2024-12-23T07:30:00',
    totalSleepTime: 390,
    totalTimeInBed: 435,
    sleepEfficiency: 90,
    wakeUps: 4,
    quality: 2,
    deepSleepPercent: 20,
    lightSleepPercent: 58,
    remSleepPercent: 15,
    sleepCycles: 4,
    snoringMinutes: 30,
    noiseLevel: 28,
    medications: ['Melatonin 3mg at 11:30 PM'],
    exercise: 'None',
    caffeine: 'Coffee, 4 cups throughout day',
    alcohol: 'None',
    naps: 'None',
    notes: 'Restless night. Too late to bed, too much caffeine.',
    source: 'sleep_app'
  },
  {
    id: 7,
    date: '2024-12-21',
    bedtime: '2024-12-21T23:00:00',
    wakeTime: '2024-12-22T07:00:00',
    totalSleepTime: 450,
    totalTimeInBed: 480,
    sleepEfficiency: 94,
    wakeUps: 2,
    quality: 4,
    deepSleepPercent: 29,
    lightSleepPercent: 51,
    remSleepPercent: 18,
    sleepCycles: 6,
    snoringMinutes: 14,
    noiseLevel: 21,
    medications: ['Melatonin 3mg at 10:30 PM'],
    exercise: 'Morning run, 6:00 AM, 50 minutes',
    caffeine: 'Coffee, 2 cups, morning',
    alcohol: 'None',
    naps: 'None',
    notes: 'Solid sleep. Exercise helped.',
    source: 'sleep_app'
  },
  {
    id: 8,
    date: '2026-01-03', // Today (last night's sleep)
    bedtime: '2026-01-02T23:15:00',
    wakeTime: '2026-01-03T07:00:00',
    totalSleepTime: 440,
    totalTimeInBed: 465,
    sleepEfficiency: 95,
    wakeUps: 1,
    quality: 4,
    deepSleepPercent: 28,
    lightSleepPercent: 52,
    remSleepPercent: 19,
    sleepCycles: 5,
    snoringMinutes: 11,
    noiseLevel: 20,
    medications: ['Melatonin 3mg at 10:45 PM'],
    exercise: 'None',
    caffeine: 'Coffee, 2 cups, 8:00 AM',
    alcohol: 'None',
    naps: 'None',
    notes: 'Good rest. Felt refreshed.',
    source: 'sleep_app'
  }
]

// Sleep prescription data
const mockSleepPrescription = {
  averageTST: 440, // minutes (7h 20m) - calculated from last 7 days
  averageTIB: 478, // minutes (7h 58m)
  sleepEfficiency: 92, // (440/478)*100
  recommendedWakeTime: '07:00',
  recommendedBedtime: '23:40', // calculated: 7:00 AM - 7h 20m
  recommendedTIB: 440, // equals averageTST
  adherenceThisWeek: 71, // percentage
  daysMetPrescription: 5,
  daysMissedPrescription: 2,
  lastUpdated: '2024-12-28'
}

function MedicalTab() {
  const [activeSubTab, setActiveSubTab] = useState('dashboard')
  const containerRef = useRef(null)

  // Water tab state
  const [todayWaterGlasses, setTodayWaterGlasses] = useState(8)
  const [dailyWaterGoal] = useState(8)

  // Exercise tab state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showProgramManager, setShowProgramManager] = useState(false)
  const [todayExercises, setTodayExercises] = useState(todayWorkouts)

  // Medications tab state
  const [todayMeds, setTodayMeds] = useState(todayMedSchedule)
  const [asNeededLog, setAsNeededLog] = useState(asNeededDosesLog)
  const [medicationFilter, setMedicationFilter] = useState('all')
  const [showAddMedModal, setShowAddMedModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [editingDose, setEditingDose] = useState(null)

  // Sleep tab state
  const [sleepEntries, setSleepEntries] = useState(mockSleepEntries)
  const [selectedSleepEntry, setSelectedSleepEntry] = useState(null)
  const [showMorningEntryForm, setShowMorningEntryForm] = useState(false)
  const [sleepFilter, setSleepFilter] = useState('last7days')

  // Nutrition tab state
  const [pinnedRecipes, setPinnedRecipes] = useState(mockPinnedRecipes)
  const [savedRecipes, setSavedRecipes] = useState(mockSavedRecipes)
  const [currentIngredients, setCurrentIngredients] = useState(mockCurrentIngredients)
  const [loggedMeals, setLoggedMeals] = useState(mockLoggedMeals)
  const [macroGoals, setMacroGoals] = useState(mockMacroGoals)
  const [plannedMeals, setPlannedMeals] = useState(mockPlannedMeals)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showMealLogger, setShowMealLogger] = useState(false)
  const [showPinRecipeForm, setShowPinRecipeForm] = useState(false)
  const [recipeSearch, setRecipeSearch] = useState('')
  const [effortFilter, setEffortFilter] = useState('all')

  // Report builder state
  const [selectedCategories, setSelectedCategories] = useState({
    dashboard: false,
    water: false,
    weight: false,
    exercise: false,
    nutrition: false,
    sleep: false,
    medications: false,
    events: false,
  })
  const [dateRange, setDateRange] = useState('last7days')
  const [exportFormat, setExportFormat] = useState('print')
  const [showPreview, setShowPreview] = useState(false)
  const [reportTemplates, setReportTemplates] = useState([
    { id: 1, name: 'Dr. Smith - Sleep Report', categories: ['sleep'], dateRange: 'last30days' },
    { id: 2, name: 'Dr. Jones - Weight & Nutrition', categories: ['weight', 'nutrition'], dateRange: 'last7days' },
  ])

  const toggleCategory = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const getSelectedCategories = () => {
    return Object.keys(selectedCategories).filter(key => selectedCategories[key])
  }

  const getDateRangeText = () => {
    const rangeMap = {
      'last7days': 'Last 7 Days',
      'last14days': 'Last 14 Days',
      'last30days': 'Last 30 Days',
      'last90days': 'Last 90 Days',
      'last6months': 'Last 6 Months',
      'last12months': 'Last 12 Months',
      'last18months': 'Last 18 Months',
      'last24months': 'Last 24 Months',
      'custom': 'Custom Range'
    }
    return rangeMap[dateRange] || dateRange
  }

  const exportAsPrint = () => {
    window.print()
  }

  const exportAsCSV = () => {
    const selected = getSelectedCategories()
    let csvContent = "Category,Date,Value,Details\n"

    // Add sample data based on selected categories
    if (selected.includes('sleep')) {
      mockSleepData.forEach(entry => {
        csvContent += `Sleep,${entry.date},${entry.hours} hours,"Quality: ${entry.quality}, Bedtime: ${entry.bedtime}, Wake: ${entry.waketime}"\n`
      })
    }
    if (selected.includes('weight')) {
      mockWeightData.forEach(entry => {
        csvContent += `Weight,${entry.date},${entry.weight} lbs,""\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateReport = () => {
    const selected = getSelectedCategories()
    if (selected.length === 0) {
      alert('Please select at least one data category')
      return
    }

    switch(exportFormat) {
      case 'print':
        setShowPreview(true) // Show preview, user can print from there
        break
      case 'csv':
        exportAsCSV()
        break
      case 'html':
        alert('HTML export coming soon!')
        break
      case 'ods':
        alert('ODS (LibreOffice Calc) export coming soon!')
        break
      case 'odt':
        alert('ODT (LibreOffice Writer) export coming soon!')
        break
      default:
        alert('Export format not yet implemented')
    }
  }

  const loadTemplate = (template) => {
    const newSelected = {
      dashboard: false,
      water: false,
      weight: false,
      exercise: false,
      nutrition: false,
      sleep: false,
      medications: false,
      events: false,
    }
    template.categories.forEach(cat => {
      newSelected[cat] = true
    })
    setSelectedCategories(newSelected)
    setDateRange(template.dateRange)
  }

  // Exercise helper functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const toggleExerciseComplete = (timeSlot, exerciseIndex) => {
    setTodayExercises(prev => ({
      ...prev,
      [timeSlot]: {
        ...prev[timeSlot],
        exercises: prev[timeSlot].exercises.map((ex, idx) =>
          idx === exerciseIndex ? { ...ex, completed: !ex.completed } : ex
        )
      }
    }))
  }

  const getWorkoutsForDate = (date) => {
    // This would calculate workouts based on loaded programs
    // For now, return mock data for demonstration
    const dateStr = date.toISOString().split('T')[0]
    if (dateStr === '2024-12-24') {
      return {
        morning: todayWorkouts.morning,
        evening: todayWorkouts.evening
      }
    }
    return { morning: null, evening: null }
  }

  const getCalendarStatus = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    if (checkDate > today) return 'upcoming'
    if (checkDate < today) return 'missed' // Would check completion in real implementation
    return 'today'
  }

  // Medications helper functions
  const toggleMedicationTaken = (timeSlot, medIndex) => {
    setTodayMeds(prev => ({
      ...prev,
      [timeSlot]: prev[timeSlot].map((med, idx) =>
        idx === medIndex
          ? { ...med, taken: !med.taken, takenTime: !med.taken ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null }
          : med
      )
    }))
  }

  const logAsNeededDose = (medId, medName, dosage, notes) => {
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    // Check if there's a recent dose (within 5 minutes) of the same medication
    const recentDose = asNeededLog.find(dose => {
      const doseTime = new Date(dose.timestamp)
      return dose.medId === medId && doseTime >= fiveMinutesAgo && doseTime <= now
    })

    if (recentDose) {
      // Combine doses - parse dosage numbers and add them
      const existingAmount = parseFloat(recentDose.dosage.match(/[\d.]+/)?.[0] || 0)
      const newAmount = parseFloat(dosage.match(/[\d.]+/)?.[0] || 0)
      const unit = dosage.match(/[a-zA-Z]+/)?.[0] || 'mg'
      const combinedDosage = `${existingAmount + newAmount}${unit}`

      // Update the existing dose
      setAsNeededLog(prev => prev.map(dose =>
        dose.id === recentDose.id
          ? { ...dose, dosage: combinedDosage, timestamp: now.toISOString() }
          : dose
      ))
    } else {
      // Create new dose entry
      const newDose = {
        id: asNeededLog.length + 1,
        medId,
        name: medName,
        dosage,
        timestamp: now.toISOString(),
        notes
      }
      setAsNeededLog([...asNeededLog, newDose])
    }
  }

  const updateAsNeededDose = (doseId, updatedTimestamp, updatedNotes) => {
    setAsNeededLog(prev => prev.map(dose =>
      dose.id === doseId
        ? { ...dose, timestamp: updatedTimestamp, notes: updatedNotes }
        : dose
    ))
    setEditingDose(null)
  }

  const deleteAsNeededDose = (doseId) => {
    setAsNeededLog(prev => prev.filter(dose => dose.id !== doseId))
  }

  const getFilteredMedications = () => {
    if (medicationFilter === 'all') return mockMedications
    if (medicationFilter === 'prescribed') return mockMedications.filter(m => m.type === 'prescribed')
    if (medicationFilter === 'non-prescribed') return mockMedications.filter(m => m.type === 'non-prescribed')
    if (medicationFilter === 'as-needed') return mockMedications.filter(m => m.schedule === 'as-needed')
    return mockMedications
  }

  const getMedicationTypeLabel = (type) => {
    if (type === 'prescribed') return 'Prescribed'
    if (type === 'non-prescribed') return 'Vitamin/Supplement'
    if (type === 'as-needed') return 'As-Needed'
    return type
  }

  const getMedicationAdherenceStats = (days) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const relevantData = days === -1
      ? medicationAdherenceHistory  // Lifetime
      : medicationAdherenceHistory.filter(entry => new Date(entry.date) >= cutoffDate)

    const met = relevantData.filter(e => e.status === 'met').length
    const partial = relevantData.filter(e => e.status === 'partial').length
    const unmet = relevantData.filter(e => e.status === 'unmet').length
    const total = relevantData.length

    return {
      met,
      partial,
      unmet,
      total,
      metPercentage: total > 0 ? Math.round((met / total) * 100) : 0,
      partialPercentage: total > 0 ? Math.round((partial / total) * 100) : 0,
      unmetPercentage: total > 0 ? Math.round((unmet / total) * 100) : 0
    }
  }

  // Sleep helper functions
  const formatSleepTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const getQualityStars = (quality) => {
    return '⭐'.repeat(quality)
  }

  const getSleepStats = () => {
    if (!sleepEntries || sleepEntries.length === 0) {
      return {
        lastNight: { totalSleepTime: 0, sleepEfficiency: 0, quality: 0, wakeUps: 0 },
        avgTST: 0,
        avgEfficiency: 0,
        last7Days: []
      }
    }

    const lastNight = sleepEntries[0]
    const last7Days = sleepEntries.slice(0, 7)

    const avgTST = Math.round(last7Days.reduce((sum, entry) => sum + entry.totalSleepTime, 0) / last7Days.length)
    const avgEfficiency = Math.round(last7Days.reduce((sum, entry) => sum + entry.sleepEfficiency, 0) / last7Days.length)

    return {
      lastNight,
      avgTST,
      avgEfficiency,
      last7Days
    }
  }

  // Nutrition helper functions
  const getTodaysMacros = () => {
    const today = '2024-12-28'
    const todaysMeals = loggedMeals.filter(meal => meal.date === today)

    const totals = todaysMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    return totals
  }

  const getMacroProgress = (consumed, goal) => {
    return Math.min(Math.round((consumed / goal) * 100), 100)
  }

  const getIngredientStatus = (status) => {
    if (status === 'use-soon') return { color: '#FFA94D', label: 'Use Soon!' }
    return { color: '#70C1B3', label: 'Fresh' }
  }

  const getFilteredSavedRecipes = () => {
    let filtered = savedRecipes

    // Search filter
    if (recipeSearch) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(recipeSearch.toLowerCase()))
      )
    }

    // Effort filter
    if (effortFilter !== 'all') {
      filtered = filtered.filter(recipe => recipe.effort === effortFilter)
    }

    return filtered
  }

  // Get today's total calories burned (mock calculation)
  const getTodayCalories = () => {
    // TODO: Calculate based on exercises completed and MET values with weight
    // For now, return mock total
    return 420
  }

  // Task completion helpers (for future Home tab widget)
  const getHealthTasksCompleted = () => {
    // Helper: Get start of current week (Sunday)
    const getWeekStart = () => {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - dayOfWeek)
      weekStart.setHours(0, 0, 0, 0)
      return weekStart
    }

    // Helper: Check if date string is today
    const isTodayDate = (dateStr) => {
      if (!dateStr) return false
      const date = new Date(dateStr)
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }

    // Helper: Check if date is in current week (Sunday to Saturday)
    const isThisWeek = (dateStr) => {
      if (!dateStr) return false
      const weekStart = getWeekStart()
      const date = new Date(dateStr)

      // Handle MM/DD format from mockWeightData
      if (dateStr.includes('/')) {
        const [month, day] = dateStr.split('/')
        const currentYear = new Date().getFullYear()
        date.setFullYear(currentYear)
        date.setMonth(parseInt(month) - 1)
        date.setDate(parseInt(day))
      }

      date.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      return date >= weekStart && date < weekEnd
    }

    // 1. Water: Met daily goal
    const waterComplete = todayWaterGlasses >= dailyWaterGoal

    // 2. Weight: Logged at least once this week (Sunday-Saturday)
    const weightComplete = mockWeightData.some(entry => isThisWeek(entry.date))

    // 3. Exercise: All today's workouts completed
    const exerciseComplete = todayExercises?.morning?.exercises?.every(ex => ex.completed) &&
                              todayExercises?.evening?.exercises?.every(ex => ex.completed)

    // 4. Sleep: Daily entry exists for today
    const sleepComplete = sleepEntries.some(entry => isTodayDate(entry.date))

    // 5. Medications: All scheduled meds taken
    const medicationsComplete = todayMeds && Object.values(todayMeds).every(slot =>
      Array.isArray(slot) && slot.every(med => med.taken)
    )

    // 6. Nutrition: At least 2 of 3 meals logged (breakfast, lunch, dinner)
    const todayMeals = loggedMeals.filter(meal => isTodayDate(meal.date))
    const uniqueMealTypes = new Set(todayMeals.map(meal => meal.mealType.toLowerCase()))
    const nutritionComplete = uniqueMealTypes.size >= 2

    const tasks = {
      water: waterComplete,
      weight: weightComplete,
      exercise: exerciseComplete,
      sleep: sleepComplete,
      medications: medicationsComplete,
      nutrition: nutritionComplete,
    }

    const completed = Object.values(tasks).filter(Boolean).length
    const total = Object.keys(tasks).length

    return { completed, total, tasks }
  }

  // Theme variation logic
  useEffect(() => {
    const applyTabTheme = () => {
      if (!containerRef.current) return

      // Get saved theme colors and tab themes
      const themeColors = JSON.parse(localStorage.getItem('themeColors') || '{}')
      const tabThemes = JSON.parse(localStorage.getItem('tabThemes') || '{}')

      // Get variation type for current sub-tab
      const tabKey = `medical-${activeSubTab}`
      const variationType = tabThemes[tabKey] || 'global'

      // If global, don't apply scoped variables (use root variables)
      if (variationType === 'global' || !themeColors.primary) {
        // Clear scoped variables
        containerRef.current.style.removeProperty('--primary-color')
        containerRef.current.style.removeProperty('--secondary-color')
        containerRef.current.style.removeProperty('--accent-color')
        containerRef.current.style.removeProperty('--primary-bg')
        containerRef.current.style.removeProperty('--secondary-bg')
        containerRef.current.style.removeProperty('--accent-bg')
        return
      }

      // Color manipulation functions (simplified inline versions)
      const hexToHsl = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2

        if (max === min) {
          h = s = 0
        } else {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
          }
        }

        return { h: h * 360, s: s * 100, l: l * 100 }
      }

      const hslToHex = (h, s, l) => {
        s /= 100
        l /= 100

        const c = (1 - Math.abs(2 * l - 1)) * s
        const x = c * (1 - Math.abs((h / 60) % 2 - 1))
        const m = l - c / 2
        let r, g, b

        if (h < 60) { r = c; g = x; b = 0 }
        else if (h < 120) { r = x; g = c; b = 0 }
        else if (h < 180) { r = 0; g = c; b = x }
        else if (h < 240) { r = 0; g = x; b = c }
        else if (h < 300) { r = x; g = 0; b = c }
        else { r = c; g = 0; b = x }

        const toHex = (n) => {
          const hex = Math.round((n + m) * 255).toString(16)
          return hex.length === 1 ? '0' + hex : hex
        }

        return '#' + toHex(r) + toHex(g) + toHex(b)
      }

      const adjustColor = (hex, { hue = 0, saturation = 0, lightness = 0 }) => {
        const hsl = hexToHsl(hex)
        let newH = (hsl.h + hue) % 360
        if (newH < 0) newH += 360
        const newS = Math.max(0, Math.min(100, hsl.s + saturation))
        const newL = Math.max(0, Math.min(100, hsl.l + lightness))
        return hslToHex(newH, newS, newL)
      }

      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }

      // Apply variation based on type
      let variedColors = { ...themeColors }

      switch (variationType) {
        case 'darker':
          variedColors.primary = adjustColor(themeColors.primary, { lightness: -15 })
          variedColors.secondary = adjustColor(themeColors.secondary, { lightness: -15 })
          variedColors.accent = adjustColor(themeColors.accent, { lightness: -15 })
          break
        case 'cooler':
          variedColors.primary = adjustColor(themeColors.primary, { hue: -30, saturation: -10 })
          variedColors.secondary = adjustColor(themeColors.secondary, { hue: -30, saturation: -10 })
          variedColors.accent = adjustColor(themeColors.accent, { hue: -30, saturation: -10 })
          break
        case 'warmer':
          variedColors.primary = adjustColor(themeColors.primary, { hue: 30, saturation: 5 })
          variedColors.secondary = adjustColor(themeColors.secondary, { hue: 30, saturation: 5 })
          variedColors.accent = adjustColor(themeColors.accent, { hue: 30, saturation: 5 })
          break
        case 'vibrant':
          variedColors.primary = adjustColor(themeColors.primary, { saturation: 20, lightness: 5 })
          variedColors.secondary = adjustColor(themeColors.secondary, { saturation: 20, lightness: 5 })
          variedColors.accent = adjustColor(themeColors.accent, { saturation: 20, lightness: 5 })
          break
        case 'softer':
          variedColors.primary = adjustColor(themeColors.primary, { saturation: -25, lightness: 10 })
          variedColors.secondary = adjustColor(themeColors.secondary, { saturation: -25, lightness: 10 })
          variedColors.accent = adjustColor(themeColors.accent, { saturation: -25, lightness: 10 })
          break
      }

      // Apply scoped CSS variables to container
      containerRef.current.style.setProperty('--primary-color', variedColors.primary)
      containerRef.current.style.setProperty('--secondary-color', variedColors.secondary)
      containerRef.current.style.setProperty('--accent-color', variedColors.accent)
      containerRef.current.style.setProperty('--primary-bg', hexToRgba(variedColors.primary, 0.1))
      containerRef.current.style.setProperty('--secondary-bg', hexToRgba(variedColors.secondary, 0.1))
      containerRef.current.style.setProperty('--accent-bg', hexToRgba(variedColors.accent, 0.1))
    }

    // Apply theme on mount and when active sub-tab changes
    applyTabTheme()

    // Listen for theme changes from Settings
    const handleThemeChange = () => {
      applyTabTheme()
    }

    window.addEventListener('themeChanged', handleThemeChange)
    window.addEventListener('tabThemeChanged', handleThemeChange)

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange)
      window.removeEventListener('tabThemeChanged', handleThemeChange)
    }
  }, [activeSubTab])

  const subTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'weight', label: 'Weight', icon: '⚖️' },
    { id: 'exercise', label: 'Exercise', icon: '🏃' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍽️' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'medications', label: 'Medications', icon: '💊' },
    { id: 'events', label: 'Events', icon: '📋' },
    { id: 'reports', label: 'Reports', icon: '📄' },
  ]

  return (
    <div className="medical-container" ref={containerRef}>
      <div className="medical-header">
        <h1 className="medical-title">Health</h1>
        <SubTabs tabs={subTabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      </div>

      {/* Dashboard Tab */}
      {activeSubTab === 'dashboard' && (
        <>
          <div style={{ padding: '0 10px 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px', maxWidth: '100%' }}>

            {/* Today's Medications Widget */}
            <div className="card" style={{ padding: '25px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                💊 Today's Medications
                {getHealthTasksCompleted().tasks.medications && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {['morning', 'evening', 'night'].map(timeSlot => (
                  <div key={timeSlot}>
                    <h4 style={{ margin: '0 0 10px 0', textTransform: 'capitalize', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                      {timeSlot}
                    </h4>
                    {todayMeds[timeSlot] && todayMeds[timeSlot].length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {todayMeds[timeSlot].map((med, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: med.taken ? 'rgba(112, 193, 179, 0.1)' : 'var(--hover-bg)', borderRadius: '6px' }}>
                            <input
                              type="checkbox"
                              checked={med.taken}
                              onChange={() => toggleMedicationTaken(timeSlot, idx)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <span style={{ flex: 1, textDecoration: med.taken ? 'line-through' : 'none', color: med.taken ? 'var(--text-secondary)' : 'var(--secondary-color)' }}>
                              {med.name} - {med.dosage}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No medications</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Workouts Widget */}
            <div className="card" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                  🏃 Today's Workouts
                  {getHealthTasksCompleted().tasks.exercise && <span style={{ fontSize: '1.2rem' }}>✅</span>}
                </h3>
                <div style={{ padding: '8px 16px', background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 169, 77, 0.1))', borderRadius: '20px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                    {getTodayCalories()} cal
                  </span>
                </div>
              </div>

              {['morning', 'evening'].map(timeSlot => {
                const workout = todayExercises[timeSlot]
                return workout && workout.exercises && workout.exercises.length > 0 ? (
                  <div key={timeSlot} style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 12px 0', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                      {timeSlot} - {workout.workoutName}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: exercise.completed ? 'rgba(112, 193, 179, 0.1)' : 'var(--hover-bg)', borderRadius: '6px' }}>
                          <input
                            type="checkbox"
                            checked={exercise.completed}
                            onChange={() => toggleExerciseComplete(timeSlot, idx)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, textDecoration: exercise.completed ? 'line-through' : 'none', color: exercise.completed ? 'var(--text-secondary)' : 'var(--secondary-color)' }}>
                            {exercise.name}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              })}
            </div>

            {/* Sleep Entry Widget */}
            <div className="card" style={{ padding: '25px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                😴 Sleep
                {getHealthTasksCompleted().tasks.sleep && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              </h3>

              {/* Last Night's Sleep Stats */}
              <div style={{ marginBottom: '15px', padding: '15px', background: 'var(--hover-bg)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Last Night</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Sleep</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      {formatSleepTime(getSleepStats().lastNight.totalSleepTime)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Efficiency</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: getSleepStats().lastNight.sleepEfficiency >= 85 ? '#70C1B3' : '#FFA94D' }}>
                      {getSleepStats().lastNight.sleepEfficiency}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quality</div>
                    <div style={{ fontSize: '1rem' }}>
                      {getQualityStars(getSleepStats().lastNight.quality)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Wake-ups</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                      {getSleepStats().lastNight.wakeUps}
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setActiveSubTab('sleep')}>
                📝 Quick Morning Entry
              </button>
            </div>

            {/* Meal Planning Widget */}
            <div className="card" style={{ padding: '25px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--primary-color)', fontWeight: '600' }}>🍽️ Meals</h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Today's Meals</h4>
                {loggedMeals.filter(meal => meal.date === '2024-12-28').length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {loggedMeals.filter(meal => meal.date === '2024-12-28').map(meal => (
                      <div key={meal.id} style={{ padding: '10px', background: 'var(--hover-bg)', borderRadius: '6px' }}>
                        <div style={{ fontWeight: '600', textTransform: 'capitalize', marginBottom: '4px', color: 'var(--secondary-color)' }}>{meal.mealType}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{meal.recipeName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {meal.calories} cal • {meal.protein}g protein
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No meals logged</p>
                )}
              </div>

              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Upcoming Planned</h4>
                {plannedMeals.slice(0, 3).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {plannedMeals.slice(0, 3).map(meal => (
                      <div key={meal.id} style={{ fontSize: '0.85rem', padding: '8px', background: 'var(--hover-bg)', borderRadius: '4px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{meal.recipeName}</span>
                        <span style={{ color: 'var(--text-secondary)' }}> • {meal.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No meals planned</p>
                )}
              </div>
            </div>

            {/* Weight Trend Widget */}
            <div className="card" style={{ padding: '25px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                ⚖️ Weight Trend
                {getHealthTasksCompleted().tasks.weight && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              </h3>

              {mockWeightData && mockWeightData.length > 0 ? (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Weight</div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                      {mockWeightData[mockWeightData.length - 1].weight} lbs
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#70C1B3' }}>
                      -3 lbs this month
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={mockWeightData.slice(-90)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} />
                      <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.7rem' }} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }} />
                      <Line type="monotone" dataKey="weight" stroke="#5B9BD5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No weight data available</p>
              )}
            </div>

            {/* Water Intake Widget */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
                💧 Water Intake
                {getHealthTasksCompleted().tasks.water && <span style={{ fontSize: '1.2rem' }}>✅</span>}
              </h3>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Today's Progress</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {todayWaterGlasses} / {dailyWaterGoal} glasses
                  </span>
                </div>
                <div style={{ height: '12px', background: 'var(--hover-bg)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #5B9BD5, #70C1B3)', width: `${(todayWaterGlasses / dailyWaterGoal) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[...Array(dailyWaterGoal)].map((_, i) => (
                  <span
                    key={i}
                    style={{ fontSize: '1.8rem', opacity: i < todayWaterGlasses ? 1 : 0.2, cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onClick={() => setTodayWaterGlasses(i + 1)}
                  >
                    💧
                  </span>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Water Tab */}
      {activeSubTab === 'water' && (
        <>
          <div className="water-tracker">
            {/* Water Target Achievement Stats */}
            <div className="water-stats-grid">
              <div className="stat-card water-stat-card">
                <h3>Lifetime Goal Achievement</h3>
                {(() => {
                  const metGoal = mockWaterData.filter(d => d.glasses >= d.goal).length
                  const total = mockWaterData.length
                  const percentage = Math.round((metGoal / total) * 100)
                  const pieData = [
                    { name: 'Met Goal', value: metGoal },
                    { name: 'Missed Goal', value: total - metGoal }
                  ]
                  const COLORS = ['#70C1B3', '#E74C3C']

                  return (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                          <Label
                            value={`${percentage}%`}
                            position="center"
                            style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )
                })()}
              </div>
              <div className="stat-card water-stat-card">
                <h3>Last 6 Months</h3>
                {(() => {
                  const metGoal = 130
                  const total = 183
                  const percentage = 71
                  const pieData = [
                    { name: 'Met Goal', value: metGoal },
                    { name: 'Missed Goal', value: total - metGoal }
                  ]
                  const COLORS = ['#70C1B3', '#E74C3C']

                  return (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                          <Label
                            value={`${percentage}%`}
                            position="center"
                            style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )
                })()}
              </div>
              <div className="stat-card water-stat-card">
                <h3>Last Month</h3>
                {(() => {
                  const metGoal = 20
                  const total = 30
                  const percentage = 67
                  const pieData = [
                    { name: 'Met Goal', value: metGoal },
                    { name: 'Missed Goal', value: total - metGoal }
                  ]
                  const COLORS = ['#70C1B3', '#E74C3C']

                  return (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                          <Label
                            value={`${percentage}%`}
                            position="center"
                            style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )
                })()}
              </div>
            </div>

            <div className="today-water card">
              <h3>Today's Water Intake</h3>
              <div className="water-progress">
                <div className="water-glasses">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`water-glass ${i < mockWaterData[mockWaterData.length - 1].glasses ? 'filled' : ''}`}>
                      💧
                    </div>
                  ))}
                </div>
                <p className="water-status">{mockWaterData[mockWaterData.length - 1].glasses} / 8 glasses</p>
                <button className="btn btn-primary">+ Add Glass</button>
              </div>
            </div>

            <div className="chart-card">
              <h3>Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockWaterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="glasses" fill="var(--primary-color)" name="Glasses" />
                  <Bar dataKey="goal" fill="var(--text-secondary)" name="Goal" opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Weight Tab */}
      {activeSubTab === 'weight' && (
        <>
          <div className="weight-tracker">
            {/* Key Metrics Summary */}
            <div className="weight-stats">
              <div className="stat-card">
                <h3>Current Weight</h3>
                <p className="stat-value large">162 lbs</p>
                <p className="stat-change positive">-3 lbs (7 days)</p>
              </div>
              <div className="stat-card">
                <h3>BMI</h3>
                <p className="stat-value large">24.1</p>
                <p className="stat-change neutral">Normal Range</p>
              </div>
              <div className="stat-card">
                <h3>Body Fat</h3>
                <p className="stat-value large">21.3%</p>
                <p className="stat-change positive">-1.0% (7 days)</p>
              </div>
              <div className="stat-card">
                <h3>Metabolic Age</h3>
                <p className="stat-value large">29</p>
                <p className="stat-change positive">-3 years (7 days)</p>
              </div>
            </div>

            {/* Weight & BMI Trends */}
            <div className="metrics-charts-grid">
              <div className="chart-card">
                <h3>Weight Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[160, 166]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="var(--primary-color)" strokeWidth={2} name="Weight (lbs)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>BMI Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[23.5, 25]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bmi" stroke="#70C1B3" strokeWidth={2} name="BMI" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Body Composition Section */}
            <div className="metrics-section card">
              <h3 className="section-title">Body Composition</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Body Fat</span>
                  <span className="metric-value">21.3%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Visceral Fat</span>
                  <span className="metric-value">6</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Subcutaneous Fat</span>
                  <span className="metric-value">17.5%</span>
                </div>
              </div>
              <div className="chart-card" style={{ marginTop: '20px' }}>
                <h4>Body Composition Trends</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 25]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="bodyFat" stroke="#E74C3C" strokeWidth={2} name="Body Fat %" />
                    <Line yAxisId="right" type="monotone" dataKey="visceralFat" stroke="#F39C12" strokeWidth={2} name="Visceral Fat" />
                    <Line yAxisId="left" type="monotone" dataKey="subcutaneousFat" stroke="#9B59B6" strokeWidth={2} name="Subcutaneous Fat %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Muscle & Bone Section */}
            <div className="metrics-section card">
              <h3 className="section-title">Muscle & Bone</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Skeletal Muscle</span>
                  <span className="metric-value">42.9%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Muscle Mass</span>
                  <span className="metric-value">120.6 lbs</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Bone Mass</span>
                  <span className="metric-value">6.8 lbs</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Fat-Free Body Weight</span>
                  <span className="metric-value">127.4 lbs</span>
                </div>
              </div>
              <div className="chart-card" style={{ marginTop: '20px' }}>
                <h4>Mass Metrics Trend (lbs)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 130]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="muscleMass" stroke="#3498DB" strokeWidth={2} name="Muscle Mass (lbs)" />
                    <Line type="monotone" dataKey="boneMass" stroke="#E67E22" strokeWidth={2} name="Bone Mass (lbs)" />
                    <Line type="monotone" dataKey="fatFreeBodyWeight" stroke="#27AE60" strokeWidth={2} name="Fat-Free Body Weight (lbs)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card" style={{ marginTop: '20px' }}>
                <h4>Skeletal Muscle Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[41, 44]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="skeletalMuscle" stroke="#2C7A7B" strokeWidth={2} name="Skeletal Muscle %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metabolism Section */}
            <div className="metrics-section card">
              <h3 className="section-title">Metabolism</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">BMR (Basal Metabolic Rate)</span>
                  <span className="metric-value">1,665 kcal/day</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Metabolic Age</span>
                  <span className="metric-value">29 years</span>
                </div>
              </div>
              <div className="chart-card" style={{ marginTop: '20px' }}>
                <h4>BMR Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1660, 1685]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="bmr" stroke="#FFA07A" strokeWidth={2} name="BMR (kcal/day)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Other Metrics Section */}
            <div className="metrics-section card">
              <h3 className="section-title">Other Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Body Water</span>
                  <span className="metric-value">59.2%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Protein</span>
                  <span className="metric-value">19.2%</span>
                </div>
              </div>
              <div className="chart-card" style={{ marginTop: '20px' }}>
                <h4>Body Water & Protein Trends</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[15, 65]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bodyWater" stroke="#5B9BD5" strokeWidth={2} name="Body Water %" />
                    <Line type="monotone" dataKey="protein" stroke="#F4A460" strokeWidth={2} name="Protein %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sync Status & Actions */}
            <div className="weight-actions card">
              <div className="sync-status">
                <span className="sync-label">Last synced:</span>
                <span className="sync-time">Never (API integration pending)</span>
              </div>
              <div className="action-buttons">
                <button className="btn btn-primary">+ Manual Entry</button>
                <button className="btn btn-secondary" disabled>🔄 Sync from Scale (Coming Soon)</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Exercise Tab */}
      {activeSubTab === 'exercise' && (
        <>
          <div className="exercise-container">
            {/* Today's Workout Widget */}
            <div className="todays-workout-widget card">
              <div className="widget-header">
                <h3>Today's Workouts - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                <div className="calories-counter">
                  <span className="calories-icon">🔥</span>
                  <div className="calories-info">
                    <span className="calories-value">425</span>
                    <span className="calories-label">calories burned</span>
                  </div>
                </div>
              </div>

              <div className="workout-sections">
                {/* Morning Section */}
                <div className="workout-section">
                  <div className="section-header">
                    <div className="section-title-group">
                      <h4>🌅 Morning</h4>
                      {todayExercises.morning && (
                        <span className="workout-name">{todayExercises.morning.workoutName}</span>
                      )}
                    </div>
                    {todayExercises.morning && todayExercises.morning.exercises.length > 0 && (
                      <span className="section-calories">🔥 280 cal</span>
                    )}
                  </div>
                  {todayExercises.morning && todayExercises.morning.exercises.length > 0 ? (
                    <div className="exercise-checklist">
                      {todayExercises.morning.exercises.map((exercise, idx) => (
                        <div key={idx} className={`exercise-item ${exercise.completed ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={exercise.completed}
                            onChange={() => toggleExerciseComplete('morning', idx)}
                            className="exercise-checkbox"
                          />
                          <div className="exercise-info">
                            <span className="exercise-name">{exercise.name}</span>
                            <span className="exercise-details">{exercise.sets} × {exercise.reps}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-workout">No workout scheduled</p>
                  )}
                </div>

                {/* Evening Section */}
                <div className="workout-section">
                  <div className="section-header">
                    <div className="section-title-group">
                      <h4>🌙 Evening</h4>
                      {todayExercises.evening && (
                        <span className="workout-name">{todayExercises.evening.workoutName}</span>
                      )}
                    </div>
                    {todayExercises.evening && todayExercises.evening.exercises.length > 0 && (
                      <span className="section-calories">🔥 145 cal</span>
                    )}
                  </div>
                  {todayExercises.evening && todayExercises.evening.exercises.length > 0 ? (
                    <div className="exercise-checklist">
                      {todayExercises.evening.exercises.map((exercise, idx) => (
                        <div key={idx} className={`exercise-item ${exercise.completed ? 'completed' : ''}`}>
                          <input
                            type="checkbox"
                            checked={exercise.completed}
                            onChange={() => toggleExerciseComplete('evening', idx)}
                            className="exercise-checkbox"
                          />
                          <div className="exercise-info">
                            <span className="exercise-name">{exercise.name}</span>
                            <span className="exercise-details">{exercise.sets} × {exercise.reps}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-workout">No workout scheduled</p>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar and Program Manager Section */}
            <div className="calendar-program-section">
              <div className="section-actions">
                <button className="btn btn-primary" onClick={() => setShowProgramManager(!showProgramManager)}>
                  📋 Program Manager
                </button>
                <button className="btn btn-secondary">+ Add One-Off Exercise</button>
              </div>

              {/* Calendar and Detail Side by Side */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Exercise Calendar */}
                <div className="exercise-calendar card" style={{ flex: '1', minWidth: '600px' }}>
                <div className="calendar-header">
                  <button
                    className="btn-icon"
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11)
                        setCurrentYear(currentYear - 1)
                      } else {
                        setCurrentMonth(currentMonth - 1)
                      }
                    }}
                  >
                    ◀
                  </button>
                  <h3>
                    {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0)
                        setCurrentYear(currentYear + 1)
                      } else {
                        setCurrentMonth(currentMonth + 1)
                      }
                    }}
                  >
                    ▶
                  </button>
                </div>

                <div className="calendar-grid">
                  <div className="calendar-day-header">Sun</div>
                  <div className="calendar-day-header">Mon</div>
                  <div className="calendar-day-header">Tue</div>
                  <div className="calendar-day-header">Wed</div>
                  <div className="calendar-day-header">Thu</div>
                  <div className="calendar-day-header">Fri</div>
                  <div className="calendar-day-header">Sat</div>

                  {/* Empty cells for days before month starts */}
                  {[...Array(getFirstDayOfMonth(currentMonth, currentYear))].map((_, idx) => (
                    <div key={`empty-${idx}`} className="calendar-day empty"></div>
                  ))}

                  {/* Days of the month */}
                  {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, idx) => {
                    const day = idx + 1
                    const date = new Date(currentYear, currentMonth, day)
                    const isSelected = selectedDate.toDateString() === date.toDateString()
                    const isToday = new Date().toDateString() === date.toDateString()
                    const workouts = getWorkoutsForDate(date)
                    const hasWorkout = workouts.morning || workouts.evening
                    const status = getCalendarStatus(date)

                    return (
                      <div
                        key={day}
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''} ${status}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="day-number">{day}</span>
                        {hasWorkout && (
                          <div className="workout-indicators">
                            {workouts.morning && <div className="indicator morning" title="Morning workout">AM</div>}
                            {workouts.evening && <div className="indicator evening" title="Evening workout">PM</div>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

                {/* Selected Day Detail View */}
                <div className="selected-day-detail card" style={{ flex: '1', minWidth: '400px' }}>
                <h3>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>

                {(() => {
                  const workouts = getWorkoutsForDate(selectedDate)
                  const hasAnyWorkout = workouts.morning || workouts.evening

                  if (!hasAnyWorkout) {
                    return <p className="no-workout-day">No workouts scheduled for this day</p>
                  }

                  return (
                    <div className="day-workouts">
                      {workouts.morning && (
                        <div className="workout-detail-section">
                          <div className="workout-detail-header">
                            <h4>🌅 Morning - {workouts.morning.workoutName}</h4>
                            <span className="workout-calories">🔥 280 cal</span>
                          </div>
                          <div className="exercises-list">
                            {workouts.morning.exercises.map((exercise, idx) => (
                              <div key={idx} className="exercise-detail-item">
                                <span className="exercise-name">{exercise.name}</span>
                                <span className="exercise-sets">{exercise.sets} × {exercise.reps}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {workouts.evening && (
                        <div className="workout-detail-section">
                          <div className="workout-detail-header">
                            <h4>🌙 Evening - {workouts.evening.workoutName}</h4>
                            <span className="workout-calories">🔥 145 cal</span>
                          </div>
                          <div className="exercises-list">
                            {workouts.evening.exercises.map((exercise, idx) => (
                              <div key={idx} className="exercise-detail-item">
                                <span className="exercise-name">{exercise.name}</span>
                                <span className="exercise-sets">{exercise.sets} × {exercise.reps}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
                </div>
              </div>

              {/* Program Manager Modal */}
              {showProgramManager && (
                <div className="program-manager-modal card">
                  <div className="modal-header">
                    <h3>Exercise Program Manager</h3>
                    <button className="btn-icon" onClick={() => setShowProgramManager(false)}>✕</button>
                  </div>

                  <div className="program-manager-content">
                    <div className="loaded-programs-section">
                      <h4>Active Programs</h4>
                      {mockLoadedPrograms.map(program => (
                        <div key={program.id} className="loaded-program-item">
                          <div className="program-info">
                            <span className="program-name">{program.programName}</span>
                            <span className="program-details">
                              {program.timeSlot.charAt(0).toUpperCase() + program.timeSlot.slice(1)} •
                              Started {new Date(program.startDate).toLocaleDateString()} •
                              {program.totalWeeks} weeks
                            </span>
                          </div>
                          <button className="btn btn-sm btn-secondary">Stop Program</button>
                        </div>
                      ))}
                    </div>

                    <div className="available-programs-section">
                      <h4>Available Programs</h4>
                      {mockProgramTemplates.map(program => (
                        <div key={program.id} className="available-program-item">
                          <div className="program-info">
                            <span className="program-name">{program.name}</span>
                            <span className="program-details">{program.totalWeeks} weeks</span>
                          </div>
                          <div className="program-actions">
                            <button className="btn btn-sm btn-primary">Load Program</button>
                            <button className="btn btn-sm btn-secondary">Edit</button>
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-primary" style={{ marginTop: '15px', width: '100%' }}>
                        + Create New Program
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Nutrition Tab */}
      {activeSubTab === 'nutrition' && (
        <>
          {/* Daily Nutrition Dashboard */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--primary-color)', fontWeight: '600' }}>Today's Nutrition</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Calories</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {getTodaysMacros().calories} / {macroGoals.calories}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#FFA94D', width: `${getMacroProgress(getTodaysMacros().calories, macroGoals.calories)}%`, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Protein</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {getTodaysMacros().protein}g / {macroGoals.protein}g
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#5B9BD5', width: `${getMacroProgress(getTodaysMacros().protein, macroGoals.protein)}%`, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Carbs</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {getTodaysMacros().carbs}g / {macroGoals.carbs}g
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#70C1B3', width: `${getMacroProgress(getTodaysMacros().carbs, macroGoals.carbs)}%`, transition: 'width 0.3s' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Fat</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {getTodaysMacros().fat}g / {macroGoals.fat}g
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#FF6B6B', width: `${getMacroProgress(getTodaysMacros().fat, macroGoals.fat)}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>Today's Meals</h4>
              {loggedMeals.filter(meal => meal.date === '2024-12-28').length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {loggedMeals.filter(meal => meal.date === '2024-12-28').map(meal => (
                    <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--hover-bg)', borderRadius: '6px' }}>
                      <div>
                        <span style={{ textTransform: 'capitalize', fontWeight: '600', color: 'var(--secondary-color)' }}>{meal.mealType}</span>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{meal.recipeName}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g protein</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '20px 0' }}>No meals logged today</p>
              )}
              <button className="btn btn-primary" style={{ marginTop: '15px' }}>+ Log Meal</button>
            </div>
          </div>

          {/* Ingredients I Have Widget */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>🥘 Ingredients I Have</h3>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>+ Add Ingredient</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {currentIngredients.map(ingredient => {
                const status = getIngredientStatus(ingredient.status)
                return (
                  <div key={ingredient.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--hover-bg)', borderRadius: '20px', border: `1px solid ${status.color}` }}>
                    <span style={{ fontWeight: '500', color: 'var(--secondary-color)' }}>{ingredient.name}</span>
                    <span style={{ fontSize: '0.75rem', color: status.color, fontWeight: '600' }}>{status.label}</span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>×</button>
                  </div>
                )
              })}
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              💡 These ingredients will be prioritized in meal recommendations
            </p>
          </div>

          {/* Pinned Recipes Section */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>📌 Pinned Recipes</h3>
              <button className="btn btn-primary">+ Pin Recipe</button>
            </div>
            {pinnedRecipes.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {pinnedRecipes.map(recipe => (
                  <div key={recipe.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '15px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--primary-color)', fontWeight: '600' }}>{recipe.title}</h4>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{recipe.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Source: {recipe.source}</span>
                        <a href={recipe.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>View Recipe →</a>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }}>Cook This</button>
                        <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '40px 20px' }}>
                No pinned recipes yet. Click "+ Pin Recipe" to save recipes you want to try!
              </p>
            )}
          </div>

          {/* Saved Recipes (Obsidian Vault) Section */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)', fontWeight: '600' }}>📚 Recipe Vault</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, padding: '8px 12px', color: 'var(--secondary-color)' }}
                />
                <select
                  value={effortFilter}
                  onChange={(e) => setEffortFilter(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', minWidth: '150px', color: 'var(--secondary-color)' }}
                >
                  <option value="all">All Effort Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {getFilteredSavedRecipes().map(recipe => (
                <div key={recipe.id} className="card" style={{ padding: '0', overflow: 'hidden', transition: 'transform 0.2s' }}>
                  <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-color)', fontWeight: '600' }}>{recipe.title}</h4>
                      <span style={{ fontSize: '0.9rem' }}>{'⭐'.repeat(recipe.rating)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {recipe.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'var(--hover-bg)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px', fontSize: '0.75rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Cal</div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{recipe.calories}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Protein</div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{recipe.protein}g</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Carbs</div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{recipe.carbs}g</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)' }}>Fat</div>
                        <div style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{recipe.fat}g</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      ⏱️ {recipe.prepTime + recipe.cookTime} min total • {recipe.servings} servings
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>Cook This Recipe</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Planning & Recommendations Section */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--primary-color)', fontWeight: '600' }}>📅 Meal Planning</h3>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>Planned Meals (Next 2 Weeks)</h4>
              {plannedMeals.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plannedMeals.map(meal => (
                    <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--hover-bg)', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{meal.recipeName}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {meal.date} • {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                        </p>
                      </div>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Remove</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '20px' }}>
                  No meals planned yet
                </p>
              )}
              <button className="btn btn-secondary" style={{ marginTop: '12px' }}>+ Add Planned Meal</button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>🎯 Meal Recommendations</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                >
                  {showRecommendations ? 'Hide' : 'Get'} Recommendations
                </button>
              </div>

              {showRecommendations && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {mockRecommendations.map(rec => (
                    <div key={rec.id} className="card" style={{ padding: '15px', background: 'var(--hover-bg)' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <img src={rec.recipe.image} alt={rec.recipe.title} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h4 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>{rec.recipe.title}</h4>
                            <span style={{ padding: '4px 10px', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                              {rec.score}% Match
                            </span>
                          </div>
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            💡 {rec.reason}
                          </p>
                          <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            <span>{rec.recipe.calories} cal</span>
                            <span>{rec.recipe.protein}g protein</span>
                            <span>{rec.recipe.prepTime + rec.recipe.cookTime} min</span>
                            <span style={{ textTransform: 'capitalize' }}>{rec.recipe.effort}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Add to Plan</button>
                            <button className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Cook Now</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Sleep Tab */}
      {activeSubTab === 'sleep' && (
        <>
          {/* Sleep Overview Stats */}
          <div className="sleep-stats">
            <div className="stat-card">
              <h3>Last Night's Sleep</h3>
              <p className="stat-value">{formatSleepTime(getSleepStats().lastNight.totalSleepTime)}</p>
              <p className="stat-change">
                Efficiency: {getSleepStats().lastNight.sleepEfficiency}%
              </p>
              <p className="stat-change">
                Quality: {getQualityStars(getSleepStats().lastNight.quality)}
              </p>
            </div>

            <div className="stat-card">
              <h3>7-Day Average</h3>
              <p className="stat-value">{formatSleepTime(getSleepStats().avgTST)}</p>
              <p className="stat-change">
                Avg Efficiency: {getSleepStats().avgEfficiency}%
              </p>
            </div>

            <div className="stat-card">
              <h3>Sleep Prescription</h3>
              <p className="stat-value">{formatSleepTime(mockSleepPrescription.recommendedTIB)}</p>
              <p className="stat-change">
                Bedtime: {mockSleepPrescription.recommendedBedtime}
              </p>
              <p className="stat-change">
                Wake: {mockSleepPrescription.recommendedWakeTime}
              </p>
            </div>

            <div className="stat-card water-stat-card">
              <h3>Weekly Adherence</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Met', value: mockSleepPrescription.daysMetPrescription },
                      { name: 'Missed', value: mockSleepPrescription.daysMissedPrescription }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {['#70C1B3', '#FF6B6B'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                    <Label
                      value={`${mockSleepPrescription.adherenceThisWeek}%`}
                      position="center"
                      style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Morning Entry Button */}
          <div style={{ padding: '0 20px', marginBottom: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowMorningEntryForm(!showMorningEntryForm)}
            >
              {showMorningEntryForm ? '− Hide Morning Entry' : '+ Quick Morning Entry'}
            </button>
          </div>

          {/* Quick Morning Entry Form (Collapsible) */}
          {showMorningEntryForm && (
            <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary-color)', fontWeight: '600' }}>Morning Sleep Entry</h3>

              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(155, 89, 182, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--sleep-color)' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  🌙 From Sleep App
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Last synced: 5 minutes ago
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--secondary-color)' }}>Bedtime:</label>
                  <input type="time" defaultValue="23:30" className="form-input" style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--secondary-color)' }}>Wake Time:</label>
                  <input type="time" defaultValue="07:00" className="form-input" style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--secondary-color)' }}>Total Sleep:</label>
                  <input type="text" defaultValue="7h 15m" className="form-input" style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: 'var(--secondary-color)' }}>Wake-ups:</label>
                  <input type="number" defaultValue="2" className="form-input" style={{ width: '100%', padding: '8px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(112, 193, 179, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--secondary-color)' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  💊 From Medications Tab
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  • Melatonin 3mg at 10:30 PM
                </p>
              </div>

              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(112, 193, 179, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--secondary-color)' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--secondary-color)' }}>
                  🏃 From Exercise Tab
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  • Morning run, 6:00 AM, 45 minutes
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>☕ Caffeine/Alcohol (Manual Entry)</h4>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => {
                      // In real implementation, this would auto-fill the textarea
                      alert('Quick add: Coffee, 2 cups (functionality will be implemented with backend)')
                    }}
                  >
                    ☕ Quick Add: 2 Cups Coffee
                  </button>
                </div>
                <textarea
                  placeholder="e.g., Coffee, 2 cups, 8:00 AM"
                  rows="2"
                  className="form-input"
                  style={{ width: '100%', padding: '8px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>😴 Naps (Manual Entry)</h4>
                <input
                  type="text"
                  placeholder="e.g., 2:00 PM, 30 minutes"
                  className="form-input"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>📝 Notes</h4>
                <textarea
                  placeholder="How did you feel? Any observations..."
                  rows="3"
                  className="form-input"
                  style={{ width: '100%', padding: '8px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary">Save Entry</button>
                <button className="btn btn-secondary" onClick={() => setShowMorningEntryForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Sleep Prescription Card */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', color: 'var(--primary-color)', fontWeight: '600' }}>
              📋 Your Sleep Prescription
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average TST (7 days)</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                  {formatSleepTime(mockSleepPrescription.averageTST)}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average TIB (7 days)</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                  {formatSleepTime(mockSleepPrescription.averageTIB)}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sleep Efficiency</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: mockSleepPrescription.sleepEfficiency >= 85 ? 'var(--secondary-color)' : '#FFA94D' }}>
                  {mockSleepPrescription.sleepEfficiency}%
                </p>
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--hover-bg)', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--primary-color)', fontWeight: '600' }}>Recommended Sleep Schedule:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⏰ Wake Time</p>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {mockSleepPrescription.recommendedWakeTime}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🌙 Bedtime</p>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {mockSleepPrescription.recommendedBedtime}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⏱️ Time in Bed</p>
                  <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', color: 'var(--secondary-color)' }}>
                    {formatSleepTime(mockSleepPrescription.recommendedTIB)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '15px', background: 'rgba(155, 89, 182, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--sleep-color)' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: 'var(--secondary-color)' }}>This Week's Adherence:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '20px', background: 'var(--hover-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${mockSleepPrescription.adherenceThisWeek}%`, height: '100%', background: 'var(--secondary-color)', transition: 'width 0.3s' }}></div>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>{mockSleepPrescription.adherenceThisWeek}%</span>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ({mockSleepPrescription.daysMetPrescription} days met, {mockSleepPrescription.daysMissedPrescription} days missed)
              </p>
            </div>

            <p style={{ marginTop: '15px', marginBottom: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              ℹ️ Prescription auto-updates weekly based on your average sleep time
            </p>
          </div>

          {/* Sleep Log Table */}
          <div className="card" style={{ margin: '0 20px 20px 20px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '600' }}>Sleep Log</h3>
              <select
                className="form-input"
                value={sleepFilter}
                onChange={(e) => setSleepFilter(e.target.value)}
                style={{ padding: '8px 12px', color: 'var(--secondary-color)' }}
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="all">All Entries</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Bedtime</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Wake Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>TST</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>TIB</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Efficiency</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Wake-ups</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Quality</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sleepEntries.slice(0, 7).map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{entry.date}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{formatTime(entry.bedtime)}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{formatTime(entry.wakeTime)}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{formatSleepTime(entry.totalSleepTime)}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{formatSleepTime(entry.totalTimeInBed)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          color: entry.sleepEfficiency >= 85 ? '#70C1B3' : entry.sleepEfficiency >= 70 ? '#FFA94D' : '#FF6B6B',
                          fontWeight: 'bold'
                        }}>
                          {entry.sleepEfficiency}%
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{entry.wakeUps}</td>
                      <td style={{ padding: '12px', color: 'var(--secondary-color)' }}>{getQualityStars(entry.quality)}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          className="btn-icon"
                          title="View details"
                          onClick={() => setSelectedSleepEntry(entry)}
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sleep Trends Chart */}
          <div className="chart-card">
            <h3 style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sleep Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sleepEntries.slice(0, 7).reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Efficiency %', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={(entry) => entry.totalSleepTime / 60}
                  stroke="#5B9BD5"
                  name="Total Sleep Time (hrs)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={(entry) => entry.totalTimeInBed / 60}
                  stroke="#A9A9A9"
                  name="Time in Bed (hrs)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sleepEfficiency"
                  stroke="#FFA94D"
                  name="Efficiency %"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Phases Chart */}
          <div className="chart-card">
            <h3 style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sleep Phases Distribution (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sleepEntries.slice(0, 7).reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="deepSleepPercent" stackId="a" fill="#1E3A8A" name="Deep Sleep %" />
                <Bar dataKey="lightSleepPercent" stackId="a" fill="#60A5FA" name="Light Sleep %" />
                <Bar dataKey="remSleepPercent" stackId="a" fill="#A855F7" name="REM Sleep %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Entry Modal */}
          {selectedSleepEntry && (
            <div className="modal-overlay" onClick={() => setSelectedSleepEntry(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                  <h3 style={{ color: 'var(--sleep-color)' }}>Sleep Details - {selectedSleepEntry.date}</h3>
                  <button className="btn-icon close-btn" onClick={() => setSelectedSleepEntry(null)}>✕</button>
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--sleep-color)' }}>
                      Core Sleep Data
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🌙 Bedtime</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{formatTime(selectedSleepEntry.bedtime)}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>☀️ Wake Time</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{formatTime(selectedSleepEntry.wakeTime)}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>😴 Total Sleep</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{formatSleepTime(selectedSleepEntry.totalSleepTime)}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🛏️ Time in Bed</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{formatSleepTime(selectedSleepEntry.totalTimeInBed)}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📊 Efficiency</p>
                        <p style={{ margin: 0, fontWeight: '600', color: selectedSleepEntry.sleepEfficiency >= 85 ? '#70C1B3' : '#FFA94D' }}>
                          {selectedSleepEntry.sleepEfficiency}%
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>💤 Wake-ups</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.wakeUps} times</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>⭐ Quality</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{getQualityStars(selectedSleepEntry.quality)}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--sleep-color)' }}>
                      Sleep App Metrics
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🧠 Deep Sleep</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.deepSleepPercent}%</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🌊 Light Sleep</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.lightSleepPercent}%</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>👁️ REM Sleep</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.remSleepPercent}%</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🔄 Sleep Cycles</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.sleepCycles} cycles</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>😴 Snoring</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.snoringMinutes} min</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>🔊 Noise Level</p>
                        <p style={{ margin: 0, fontWeight: '600' }}>{selectedSleepEntry.noiseLevel} dB</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', color: 'var(--sleep-color)' }}>
                      Daily Activities
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>💊 Medications:</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedSleepEntry.medications.join(', ')}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>🏃 Exercise:</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedSleepEntry.exercise}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>☕ Caffeine:</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedSleepEntry.caffeine}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>🍺 Alcohol:</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedSleepEntry.alcohol}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: '600' }}>😴 Naps:</p>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedSleepEntry.naps}</p>
                      </div>
                    </div>
                  </div>

                  {selectedSleepEntry.notes && (
                    <div>
                      <h4 style={{ marginBottom: '10px', color: 'var(--sleep-color)' }}>📝 Notes:</h4>
                      <div style={{ padding: '12px', background: 'var(--hover-bg)', borderRadius: '6px' }}>
                        <p style={{ margin: 0 }}>{selectedSleepEntry.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedSleepEntry(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Medications Tab */}
      {activeSubTab === 'medications' && (
        <>
          {/* Medication Adherence Stats */}
          <div className="medical-stats">
            <div className="stat-card water-stat-card">
              <h3>Lifetime Adherence</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Met', value: getMedicationAdherenceStats(-1).met },
                      { name: 'Partial', value: getMedicationAdherenceStats(-1).partial },
                      { name: 'Unmet', value: getMedicationAdherenceStats(-1).unmet }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {['#70C1B3', '#FFA94D', '#FF6B6B'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                    <Label
                      value={`${getMedicationAdherenceStats(-1).metPercentage}%`}
                      position="center"
                      style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="stat-card water-stat-card">
              <h3>Last 6 Months</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Met', value: getMedicationAdherenceStats(180).met },
                      { name: 'Partial', value: getMedicationAdherenceStats(180).partial },
                      { name: 'Unmet', value: getMedicationAdherenceStats(180).unmet }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {['#70C1B3', '#FFA94D', '#FF6B6B'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                    <Label
                      value={`${getMedicationAdherenceStats(180).metPercentage}%`}
                      position="center"
                      style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="stat-card water-stat-card">
              <h3>Last Month</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Met', value: getMedicationAdherenceStats(30).met },
                      { name: 'Partial', value: getMedicationAdherenceStats(30).partial },
                      { name: 'Unmet', value: getMedicationAdherenceStats(30).unmet }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {['#70C1B3', '#FFA94D', '#FF6B6B'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                    <Label
                      value={`${getMedicationAdherenceStats(30).metPercentage}%`}
                      position="center"
                      style={{ fontSize: '24px', fontWeight: 'bold', fill: 'var(--secondary-color)' }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="medications-container">
            {/* Today's Medications Widget */}
            <div className="todays-medications-widget card">
              <h3>Today's Medications - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>

              <div className="med-time-sections">
                {/* Morning Section */}
                <div className="med-time-section">
                  <h4>🌅 Morning</h4>
                  {todayMeds.morning.length > 0 ? (
                    <div className="med-checklist">
                      {todayMeds.morning.map((med, idx) => (
                        <div key={idx} className={`med-item ${med.taken ? 'taken' : ''}`}>
                          <input
                            type="checkbox"
                            checked={med.taken}
                            onChange={() => toggleMedicationTaken('morning', idx)}
                            className="med-checkbox"
                          />
                          <div className="med-info">
                            <span className="med-name">{med.name}</span>
                            <span className="med-dosage">{med.dosage}</span>
                          </div>
                          {med.taken && med.takenTime && (
                            <span className="taken-time">✓ {med.takenTime}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-meds">No medications scheduled</p>
                  )}
                </div>

                {/* Evening Section */}
                <div className="med-time-section">
                  <h4>🌆 Evening</h4>
                  {todayMeds.evening.length > 0 ? (
                    <div className="med-checklist">
                      {todayMeds.evening.map((med, idx) => (
                        <div key={idx} className={`med-item ${med.taken ? 'taken' : ''}`}>
                          <input
                            type="checkbox"
                            checked={med.taken}
                            onChange={() => toggleMedicationTaken('evening', idx)}
                            className="med-checkbox"
                          />
                          <div className="med-info">
                            <span className="med-name">{med.name}</span>
                            <span className="med-dosage">{med.dosage}</span>
                          </div>
                          {med.taken && med.takenTime && (
                            <span className="taken-time">✓ {med.takenTime}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-meds">No medications scheduled</p>
                  )}
                </div>

                {/* Night Section */}
                <div className="med-time-section">
                  <h4>🌙 Night</h4>
                  {todayMeds.night.length > 0 ? (
                    <div className="med-checklist">
                      {todayMeds.night.map((med, idx) => (
                        <div key={idx} className={`med-item ${med.taken ? 'taken' : ''}`}>
                          <input
                            type="checkbox"
                            checked={med.taken}
                            onChange={() => toggleMedicationTaken('night', idx)}
                            className="med-checkbox"
                          />
                          <div className="med-info">
                            <span className="med-name">{med.name}</span>
                            <span className="med-dosage">{med.dosage}</span>
                          </div>
                          {med.taken && med.takenTime && (
                            <span className="taken-time">✓ {med.takenTime}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-meds">No medications scheduled</p>
                  )}
                </div>
              </div>

              {/* As-Needed Section */}
              <div className="as-needed-section card">
                <div className="as-needed-header">
                  <h3>💊 As-Needed Medications</h3>
                  <button className="btn btn-sm btn-primary">+ Log Dose</button>
                </div>

                {asNeededLog.length > 0 ? (
                  <div className="dose-log">
                    {asNeededLog.map(dose => (
                      <div key={dose.id} className="dose-entry">
                        <div className="dose-entry-info">
                          <span className="dose-med-name">{dose.name} - {dose.dosage}</span>
                          <span className="dose-timestamp">
                            {new Date(dose.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                          {dose.notes && <span className="dose-notes">Note: {dose.notes}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-icon"
                            title="Edit dose"
                            onClick={() => setEditingDose(dose)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon"
                            title="Delete dose"
                            onClick={() => deleteAsNeededDose(dose.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-doses-today">No as-needed doses logged today</p>
                )}

                <div className="quick-actions">
                  {mockMedications.filter(m => m.schedule === 'as-needed').map(med => (
                    <button
                      key={med.id}
                      className="quick-action-btn"
                      onClick={() => logAsNeededDose(med.id, med.name, med.dosage, '')}
                    >
                      <span className="med-name">{med.name}</span>
                      <span className="med-dosage">{med.dosage}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* All Medications List */}
            <div className="all-medications-section">
              <div className="medications-header">
                <h3>All Medications</h3>
                <button className="btn btn-primary" onClick={() => setShowAddMedModal(true)}>+ Add Medication</button>
              </div>

              {/* Filter Tabs */}
              <div className="medication-filters">
                <button
                  className={`filter-tab ${medicationFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMedicationFilter('all')}
                >
                  All ({mockMedications.length})
                </button>
                <button
                  className={`filter-tab ${medicationFilter === 'prescribed' ? 'active' : ''}`}
                  onClick={() => setMedicationFilter('prescribed')}
                >
                  Prescribed ({mockMedications.filter(m => m.type === 'prescribed').length})
                </button>
                <button
                  className={`filter-tab ${medicationFilter === 'non-prescribed' ? 'active' : ''}`}
                  onClick={() => setMedicationFilter('non-prescribed')}
                >
                  Vitamins ({mockMedications.filter(m => m.type === 'non-prescribed').length})
                </button>
                <button
                  className={`filter-tab ${medicationFilter === 'as-needed' ? 'active' : ''}`}
                  onClick={() => setMedicationFilter('as-needed')}
                >
                  As-Needed ({mockMedications.filter(m => m.schedule === 'as-needed').length})
                </button>
              </div>

              {/* Medications List */}
              <div className="medications-list">
                {getFilteredMedications().map(med => (
                  <div key={med.id} className="medication-card card">
                    <div className="med-card-header">
                      <div className="med-card-title">
                        <h4>{med.name}</h4>
                        <span className={`med-type-badge ${med.type}`}>
                          {getMedicationTypeLabel(med.type)}
                        </span>
                      </div>
                      <div className="med-card-actions">
                        <button className="btn-icon" title="View medication info" onClick={() => window.open(`https://www.drugs.com/search.php?searchterm=${encodeURIComponent(med.name)}`, '_blank')}>
                          ℹ️
                        </button>
                        <button className="btn-icon" title="Edit" onClick={() => setEditingMed(med)}>✏️</button>
                        <button className="btn-icon" title="Delete">🗑️</button>
                      </div>
                    </div>

                    <div className="med-card-details">
                      <div className="med-detail-item">
                        <span className="detail-label">Dosage:</span>
                        <span className="detail-value">{med.dosage}</span>
                      </div>
                      {med.schedule === 'regular' ? (
                        <>
                          <div className="med-detail-item">
                            <span className="detail-label">Schedule:</span>
                            <span className="detail-value">
                              {med.frequency.charAt(0).toUpperCase() + med.frequency.slice(1)} - {med.timeSlots.join(', ')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="med-detail-item">
                          <span className="detail-label">Instructions:</span>
                          <span className="detail-value">{med.instructions}</span>
                        </div>
                      )}
                      {med.doctor && (
                        <div className="med-detail-item">
                          <span className="detail-label">Doctor:</span>
                          <span className="detail-value">{med.doctor}</span>
                        </div>
                      )}
                      {med.pharmacy && (
                        <div className="med-detail-item">
                          <span className="detail-label">Pharmacy:</span>
                          <span className="detail-value">{med.pharmacy}</span>
                        </div>
                      )}
                      {med.notes && (
                        <div className="med-detail-item">
                          <span className="detail-label">Notes:</span>
                          <span className="detail-value">{med.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Dose Modal */}
          {editingDose && (
            <div className="modal-overlay" onClick={() => setEditingDose(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h3>Edit Dose</h3>
                  <button className="btn-icon close-btn" onClick={() => setEditingDose(null)}>✕</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Medication
                    </label>
                    <input
                      type="text"
                      value={`${editingDose.name} - ${editingDose.dosage}`}
                      disabled
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--hover-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Time Taken
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={new Date(editingDose.timestamp).toISOString().slice(0, 16)}
                      id="edit-dose-time"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Notes (optional)
                    </label>
                    <textarea
                      defaultValue={editingDose.notes || ''}
                      id="edit-dose-notes"
                      rows="3"
                      placeholder="e.g., Headache, muscle pain..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setEditingDose(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const newTime = document.getElementById('edit-dose-time').value
                      const newNotes = document.getElementById('edit-dose-notes').value
                      updateAsNeededDose(editingDose.id, new Date(newTime).toISOString(), newNotes)
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Events Tab */}
      {activeSubTab === 'events' && (
        <>
          <div className="events-header" style={{ marginBottom: '20px', padding: '0 20px' }}>
            <button className="btn btn-primary">+ Add Health Event</button>
          </div>
          <div className="events-list" style={{ padding: '0 20px' }}>
            {mockHealthEvents.map(event => (
              <div key={event.id} className="event-card card">
                <div className="event-header-row">
                  <div className="event-main-info">
                    <h3>{event.description}</h3>
                    <p className="event-date">📅 {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div className="event-badges">
                    <span className={`severity-badge severity-${event.severity.toLowerCase()}`}>
                      {event.severity}
                    </span>
                    <span className={`duration-badge duration-${event.duration.toLowerCase()}`}>
                      {event.duration}
                    </span>
                  </div>
                </div>
                <div className="event-notes">
                  <p><strong>Notes:</strong> {event.notes}</p>
                </div>
                <div className="event-actions">
                  <button className="btn-icon" title="Edit">✏️</button>
                  <button className="btn-icon" title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Reports Tab */}
      {activeSubTab === 'reports' && (
        <>
          <div className="reports-container">
            <div className="reports-grid">
              {/* Report Builder Section */}
              <div className="report-builder card">
                <h3>Build Custom Report</h3>

                <div className="report-section">
                  <h4>Select Data Categories</h4>
                  <div className="category-checkboxes">
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.dashboard}
                        onChange={() => toggleCategory('dashboard')}
                      />
                      <span>📊 Dashboard Overview</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.water}
                        onChange={() => toggleCategory('water')}
                      />
                      <span>💧 Water Intake</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.weight}
                        onChange={() => toggleCategory('weight')}
                      />
                      <span>⚖️ Weight Tracking</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.exercise}
                        onChange={() => toggleCategory('exercise')}
                      />
                      <span>🏃 Exercise Log</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.nutrition}
                        onChange={() => toggleCategory('nutrition')}
                      />
                      <span>🍽️ Nutrition Data</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.sleep}
                        onChange={() => toggleCategory('sleep')}
                      />
                      <span>😴 Sleep Records</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.medications}
                        onChange={() => toggleCategory('medications')}
                      />
                      <span>💊 Medications</span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.events}
                        onChange={() => toggleCategory('events')}
                      />
                      <span>📋 Health Events</span>
                    </label>
                  </div>
                </div>

                <div className="report-section">
                  <h4>Date Range</h4>
                  <select
                    className="date-range-select"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="last7days">Last 7 Days</option>
                    <option value="last14days">Last 14 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="last90days">Last 90 Days</option>
                    <option value="last6months">Last 6 Months</option>
                    <option value="last12months">Last 12 Months</option>
                    <option value="last18months">Last 18 Months</option>
                    <option value="last24months">Last 24 Months</option>
                    <option value="custom">Custom Range (coming soon)</option>
                  </select>
                </div>

                <div className="report-section">
                  <h4>Export Format</h4>
                  <select
                    className="date-range-select"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="print">Print / PDF</option>
                    <option value="csv">CSV (Spreadsheet)</option>
                    <option value="html">HTML File</option>
                    <option value="ods">ODS (LibreOffice Calc)</option>
                    <option value="odt">ODT (LibreOffice Writer)</option>
                  </select>
                </div>

                <div className="report-actions">
                  <button className="btn btn-secondary" onClick={() => setShowPreview(true)}>Preview Report</button>
                  <button className="btn btn-primary" onClick={generateReport}>
                    Generate {exportFormat === 'print' ? 'Print/PDF' : exportFormat.toUpperCase()}
                  </button>
                  <button className="btn btn-secondary">Save as Template</button>
                </div>
              </div>

              {/* Saved Templates Section */}
              <div className="saved-templates card">
                <h3>Saved Report Templates</h3>
                <div className="templates-list">
                  {reportTemplates.map(template => (
                    <div key={template.id} className="template-item">
                      <div className="template-info">
                        <h4>{template.name}</h4>
                        <p className="template-details">
                          {template.categories.join(', ')} • {template.dateRange}
                        </p>
                      </div>
                      <div className="template-actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => loadTemplate(template)}
                        >
                          Load
                        </button>
                        <button className="btn btn-sm btn-secondary">Generate</button>
                        <button className="btn-icon" title="Delete">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '15px', width: '100%' }}>
                  + Create New Template
                </button>
              </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
              <div className="preview-modal-overlay" onClick={() => setShowPreview(false)}>
                <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="preview-header">
                    <h2>Report Preview</h2>
                    <button className="btn-icon close-btn" onClick={() => setShowPreview(false)}>✕</button>
                  </div>

                  <div className="preview-content">
                    <div className="report-document">
                      <div className="report-title">
                        <h1>Health Report</h1>
                        <p className="report-subtitle">Date Range: {getDateRangeText()}</p>
                        <p className="report-date">Generated: {new Date().toLocaleDateString()}</p>
                      </div>

                      {selectedCategories.sleep && (
                        <div className="report-section-preview">
                          <h3>😴 Sleep Records</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Quality</th>
                                <th>Bedtime</th>
                                <th>Wake Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockSleepData.map((entry, idx) => (
                                <tr key={idx}>
                                  <td>{entry.date}</td>
                                  <td>{entry.hours}</td>
                                  <td>{entry.quality}</td>
                                  <td>{entry.bedtime}</td>
                                  <td>{entry.waketime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedCategories.weight && (
                        <div className="report-section-preview">
                          <h3>⚖️ Weight Tracking</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Weight (lbs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockWeightData.map((entry, idx) => (
                                <tr key={idx}>
                                  <td>{entry.date}</td>
                                  <td>{entry.weight}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedCategories.exercise && (
                        <div className="report-section-preview">
                          <h3>🏃 Exercise Log</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Duration (min)</th>
                                <th>Calories</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockExerciseData.map((entry, idx) => (
                                <tr key={idx}>
                                  <td>{entry.date}</td>
                                  <td>{entry.type}</td>
                                  <td>{entry.duration}</td>
                                  <td>{entry.calories}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedCategories.nutrition && (
                        <div className="report-section-preview">
                          <h3>🍽️ Nutrition Data</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Meal</th>
                                <th>Description</th>
                                <th>Calories</th>
                                <th>Protein (g)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockNutritionData.map((entry, idx) => (
                                <tr key={idx}>
                                  <td>{entry.date}</td>
                                  <td>{entry.meal}</td>
                                  <td>{entry.description}</td>
                                  <td>{entry.calories}</td>
                                  <td>{entry.protein}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedCategories.medications && (
                        <div className="report-section-preview">
                          <h3>💊 Medications</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Medication</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockMedications.map((med, idx) => (
                                <tr key={idx}>
                                  <td>{med.name}</td>
                                  <td>{med.dosage}</td>
                                  <td>{med.frequency}</td>
                                  <td>{med.time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {selectedCategories.events && (
                        <div className="report-section-preview">
                          <h3>📋 Health Events</h3>
                          <table className="report-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Severity</th>
                                <th>Duration</th>
                                <th>Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mockHealthEvents.map((event, idx) => (
                                <tr key={idx}>
                                  <td>{new Date(event.date).toLocaleDateString()}</td>
                                  <td>{event.description}</td>
                                  <td>{event.severity}</td>
                                  <td>{event.duration}</td>
                                  <td>{event.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {getSelectedCategories().length === 0 && (
                        <div className="no-data-message">
                          <p>No data categories selected. Please select at least one category to preview.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="preview-footer">
                    <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
                    <button className="btn btn-primary" onClick={exportAsPrint}>Print / Save as PDF</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MedicalTab
