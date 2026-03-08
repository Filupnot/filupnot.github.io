export type WorkoutType = 'push' | 'pull' | 'legs';

export interface ExerciseDef {
  id: string;
  name: string;
  note?: string;
  defaultSets: number;
}

export interface WorkoutDef {
  type: WorkoutType;
  label: string;
  exercises: ExerciseDef[];
}

export interface SetEntry {
  value: number;
  pr?: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  type: WorkoutType;
  date: string;
  started_at: string;
  completed_at?: string;
  exercises: SessionExercise[];
}

export const REST_SECONDS = 90;

export const TIMER_CIRCUMFERENCE = 2 * Math.PI * 38;

export const DEFAULT_WORKOUT_DEFS: WorkoutDef[] = [
  {
    type: 'push',
    label: 'Push',
    exercises: [
      { id: 'barbell-bench-press', name: 'Barbell Bench Press', defaultSets: 3 },
      { id: 'incline-db-press-g4', name: 'Incline Dumbbell Bench Press', note: 'grade 4', defaultSets: 5 },
      { id: 'seated-side-raises', name: 'Seated Side Raises', defaultSets: 5 },
      { id: 'standing-side-raises', name: 'Standing Side Raises', defaultSets: 5 },
      { id: 'incline-db-press-g7', name: 'Incline Dumbbell Bench Press', note: 'grade 7', defaultSets: 5 },
      { id: 'skull-crushers', name: 'Skull Crushers', defaultSets: 5 },
      { id: 'db-skull-crushers', name: 'Dumbbell Skull Crushers', note: '15 reps', defaultSets: 3 },
      { id: 'decline-cable-flyes', name: 'Decline Cable Flyes', note: '15 reps', defaultSets: 3 },
      { id: 'rope-tricep-pulldown', name: 'Rope Tricep Pulldown', defaultSets: 3 }
    ]
  },
  {
    type: 'pull',
    label: 'Pull',
    exercises: [
      { id: 'deadlift', name: 'Deadlift', defaultSets: 4 },
      { id: 'pull-ups', name: 'Pull-ups', defaultSets: 4 },
      { id: 'barbell-row', name: 'Barbell Row', defaultSets: 4 },
      { id: 'lat-pulldown', name: 'Lat Pulldown', defaultSets: 4 },
      { id: 'cable-row', name: 'Cable Row', defaultSets: 4 },
      { id: 'face-pulls', name: 'Face Pulls', defaultSets: 3 },
      { id: 'bicep-curls', name: 'Bicep Curls', defaultSets: 3 }
    ]
  },
  {
    type: 'legs',
    label: 'Legs',
    exercises: [
      { id: 'squat', name: 'Squat', defaultSets: 4 },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', defaultSets: 4 },
      { id: 'leg-press', name: 'Leg Press', defaultSets: 4 },
      { id: 'leg-curl', name: 'Leg Curl', defaultSets: 3 },
      { id: 'leg-extension', name: 'Leg Extension', defaultSets: 3 },
      { id: 'calf-raises', name: 'Calf Raises', defaultSets: 4 }
    ]
  }
];

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getPrevBest(lastSessionExercise: SessionExercise | undefined): number {
  if (!lastSessionExercise || lastSessionExercise.sets.length === 0) return 0;
  return Math.max(...lastSessionExercise.sets.map((s) => s.value));
}
