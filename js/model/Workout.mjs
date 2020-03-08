'use strict';

import WorkoutSet from "js/model/WorkoutSet.mjs";

/**
 * A collection of actual workout sets.
 */
export default class Workout {
    /**
     * @param {Array<WorkoutSet>} sets
     */
    constructor(sets) {
        this._sets = sets || [];
    };

    /**
     * @param {WorkoutSet} workoutSet
     */
    addSet(set) {
        this._sets.push(set);
    };
}