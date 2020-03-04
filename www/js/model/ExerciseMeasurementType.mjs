'use strict';

// A definition of high-level unit of measurement (duration, repetition, etc.)
export default class ExerciseMeasurementType {
    constructor(token, label, labelPlural, unitOfMeasurement) {
        this.token = token;
        this.label = label;
        this.labelPlural = labelPlural;
        this.unitOfMeasurement = unitOfMeasurement;
    };
}