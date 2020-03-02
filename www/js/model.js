'use strict';

// A definition of a generic form of exercise (push-up, sit-up, run, etc.)
class ExerciseType {
    constructor(token, label, labelPlural) {
        this.token = token;
        this.label = label;
        this.labelPlural = labelPlural;
    };
}

const ExerciseTypes = {
    'pushup': new ExerciseType('pushup', 'Push-Up', 'Push-Ups'),
    'pushup-widegrip': new ExerciseType('pushup-widegrip', 'Wide Grip Push-Up', 'Wide Grip Push-Ups'),
    'crunch': new ExerciseType('crunch', 'Crunch', 'Crunches'),
    'curl': new ExerciseType('curl', 'Curl', 'Curls'),
    'cycle': new ExerciseType('cycle', 'Cycling', 'Cycling'),
    'sex': new ExerciseType('sex', 'Sex', 'Sex')
};

class ExerciseCondition {
    constructor(exerciseMeasurementRequirement) {
        this.exerciseMeasurementRequirement = exerciseMeasurementRequirement;
    };
}

// A definition of high-level unit of measurement (duration, repetition, etc.)
class ExerciseMeasurementType {
    constructor(token, label, labelPlural, unitOfMeasurement) {
        this.token = token;
        this.label = label;
        this.labelPlural = labelPlural;
        this.unitOfMeasurement = unitOfMeasurement;
    };
}

const ExerciseMeasurementTypes = {
    'repetition': new ExerciseMeasurementType('repetition', 'Repetition', 'Repetition', 'reps'),
    'duration': new ExerciseMeasurementType('duration', 'Duration', 'Duration', 'mins'),
    'weight': new ExerciseMeasurementType('weight', 'Weight', 'Weight', 'kg'),
    'heartrate': new ExerciseMeasurementType('heartrate', 'Heart Rate', 'Heart Rate', 'bpm'),
    'heartrate-average': new ExerciseMeasurementType('heartrate-average', 'Average Heart Rate', 'Heart Rate', 'bpm'),
    'heartrate-peak': new ExerciseMeasurementType('heartrate-peak', 'Peak Heart Rate', 'Peak Heart Rate', 'bpm')
};

// A single measurement (repetition, duration, etc.) for a specific exercise within a set
class ExerciseMeasurement {
    constructor(exerciseMeasurementType, value) {
        this.exerciseMeasurementType = exerciseMeasurementType;
        this.value = value;
    };
}

class WorkoutExercise {
    constructor(exerciseType, exerciseSetGoals, exerciseConditions) {
        this.exerciseType = exerciseType;
        this.exerciseConditions = exerciseConditions;
        this.exerciseSetGoals = exerciseSetGoals;
    };
}

// A user-defined workout plan, defined by labels, exercise types, and exercise measurement goals
class WorkoutPlan {
    /**
     * @param {String} token
     * @param {String} label
     */
    constructor(token, label, exercises) {
        this.token = token;
        this.label = label;
        this.exercises = exercises;
    };
}

const WorkoutPlans = {
    'core': new WorkoutPlan('core', 'Core', [
        new WorkoutExercise(ExerciseTypes.pushup, [
            new ExerciseMeasurement(ExerciseMeasurementTypes.repetition, 10) ] ),
        new WorkoutExercise(ExerciseTypes.crunch, [
            new ExerciseMeasurement(ExerciseMeasurementTypes.repetition, 30) ] ),
        new WorkoutExercise(ExerciseTypes.curl, [
            new ExerciseMeasurement(ExerciseMeasurementTypes.repetition, 5) ] )
        ]),
    'cardio': new WorkoutPlan('cardio', 'Cardio', [
        new WorkoutExercise(ExerciseTypes.cycle,
            [ new ExerciseMeasurement(ExerciseMeasurementTypes.duration, 20) ],
            [ new ExerciseCondition(new ExerciseCondition(ExerciseMeasurementTypes.heartrate, 155)) ])
        ]),
    'private': new WorkoutPlan('private', 'Private', [
        new WorkoutExercise(ExerciseTypes.sex, [
            new ExerciseMeasurement(ExerciseMeasurementTypes.duration, 40)
        ])
    ])
};

// A collection of completed measurements for a specific exercise within a workout set, actual or expected
class ExerciseSet {
    constructor(exerciseType, exerciseMeasurements) {
        this.exerciseType = exerciseType;
        this.exerciseMeasurements = exerciseMeasurements;
    };
}

// A timestamped collection of exercises completed as a single set against a workout type
class WorkoutSet {
    constructor(workoutType, exerciseSets, timestamp) {
        this.timestamp = timestamp || Date.now();
        this.workoutType = workoutType;
        this.exerciseSets = exerciseSets;
    };
}

// A collection of actual workout sets.
class Workout {
    constructor(workoutPlan, workoutSets) {
        this.workoutPlan = workoutPlan;
        this.workoutSets = [];
    };

    addWorkoutSet(workoutSet) {
        this.workoutSets.push(workoutSet);
    };
}

const WorkoutsToday = {
    'core': new Workout(WorkoutPlans.core),
    'cardio': new Workout(WorkoutPlans.cardio),
    'private': new Workout(WorkoutPlans.private)
}