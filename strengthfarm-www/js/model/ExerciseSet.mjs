'use strict';

// A collection of completed measurements for a specific exercise within a workout set, actual or expected
export default class ExerciseSet {
    constructor(exerciseType, exerciseMeasurements) {
        this.exerciseType = exerciseType;
        this.exerciseMeasurements = exerciseMeasurements;
    };
}