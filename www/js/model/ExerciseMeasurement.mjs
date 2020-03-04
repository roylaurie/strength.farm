'use strict';

// A single measurement (repetition, duration, etc.) for a specific exercise within a set
export default class ExerciseMeasurement {
    constructor(exerciseMeasurementType, value) {
        this.exerciseMeasurementType = exerciseMeasurementType;
        this.value = value;
    };
}