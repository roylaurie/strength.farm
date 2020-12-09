'use strict';

/**
 * A definition of high-level unit of measurement (duration, repetition, etc.)
 */
export default class ExerciseMeasurementType {
    /**
     * @param {String} name
     * @param {String} namePlural
     * @param {String} unitOfMeasurement
     */
    constructor(name, namePlural, unitOfMeasurement) {
        this._name = name;
        this._namePlural = namePlural;
        this._unitOfMeasurement = unitOfMeasurement;
    };

    /**
     * @returns {String}
     */
    getName() {
        return this._name;
    };

    /**
     * @returns {String}
     */
    getNamePlural() {
        return this._namePlural;
    };

    /**
     * @returns {String}
     */
    getUnitOfMeasurement() {
        return this._unitOfMeasurement;
    };
}