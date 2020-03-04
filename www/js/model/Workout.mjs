'use strict';

// A collection of actual workout sets.
export default class Workout {
    constructor(workoutPlan, workoutSets) {
        this.workoutPlan = workoutPlan;
        this.workoutSets = [];
    };

    addWorkoutSet(workoutSet) {
        this.workoutSets.push(workoutSet);
    };
}