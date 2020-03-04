'use strict';

// A timestamped collection of exercises completed as a single set against a workout type
export default class WorkoutSet {
    constructor(workoutType, exerciseSets, timestamp) {
        this.timestamp = timestamp || Date.now();
        this.workoutType = workoutType;
        this.exerciseSets = exerciseSets;
    };
}