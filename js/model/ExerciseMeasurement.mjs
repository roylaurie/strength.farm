'use strict';

import ExerciseMeasurementType from "js/model/ExerciseMeasurementType.mjs";

/**
 * A single measurement (repetition, duration, etc.) for a specific exercise within a set
 */
export default class ExerciseMeasurement {
    /**
     * @param {ExerciseMeasurementType} type
     * @param {number} value
     */
    constructor(type, value) {
        this._type = type;
        this._value = value;
    };

    /**
     * @returns {ExerciseMeasurementType}
     */
    getType() {
        return this._type;
    };

    /**
     * @returns {number}
     */
    getValue() {
        return this._value;
    };
}