'use strict';

/**
 * A timestamped collection of exercises completed as a single set against a workout type
 */
export default class WorkoutSet {
    /**
     * @param {WorkoutType} workoutType
     * @param {Array<ExerciseSet>} exerciseSets
     * @param {Number} timestamp
     */
    constructor(workoutType, exerciseSets, timestamp) {
        this.timestamp = timestamp || Date.now();
        this.workoutType = workoutType;
        this.exerciseSets = exerciseSets;
    };
}