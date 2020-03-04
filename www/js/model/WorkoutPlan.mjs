'use strict';

// A user-defined workout plan, defined by labels, exercise types, and exercise measurement goals
export default class WorkoutPlan {
    /**
     * @param {String} token
     * @param {String} label
     */
    constructor(token, label, exercises) {
        this.token = token;
        this.label = label;
        this.exercises = exercises;
    };
}