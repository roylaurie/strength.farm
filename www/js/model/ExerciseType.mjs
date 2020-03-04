'use strict';

// A definition of a generic form of exercise (push-up, sit-up, run, etc.)
export default class ExerciseType {
    constructor(token, label, labelPlural) {
        this.token = token;
        this.label = label;
        this.labelPlural = labelPlural;
    };
}