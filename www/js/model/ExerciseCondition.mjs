'use strict';

export default class ExerciseCondition {
    /**
     * @param {ExerciseMeasurement} measurementRequirement
     */
    constructor(measurementRequirement) {
        this._measurementRequirement = measurementRequirement;
    };

    getMeasurementRequirement() {
        return this._measurementRequirement;
    }
}