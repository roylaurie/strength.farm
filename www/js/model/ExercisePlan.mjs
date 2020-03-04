'use strict';

import ExerciseType from "js/model/ExerciseType.mjs";
import ExerciseMeasurement from "js/model/ExerciseMeasurement.mjs";
import ExerciseCondition from "js/model/ExerciseCondition.mjs";

export default class ExercisePlan {
    /**
     * @param {ExerciseType} type
     * @param {Array<ExerciseMeasurement>} measurements
     * @param {Array<ExerciseCondition>} conditions
     */
    constructor(type, measurements, conditions) {
        this._type = type;
        this._measurements = measurements || [];
        this._conditions = conditions || [];
    };

    /**
     * @returns {ExerciseType}
     */
    getType() {
        return this._type;
    };

    /**
     * @returns {Array<ExerciseMeasurement>}
     */
    getMeasurements() {
        return this._measurements;
    }

    /**
     * @returns {Array<ExerciseCondition>}
     */
    getConditions() {
        return this._conditions;
    }
}