'use strict';

import WorkoutExercise from 'js/model/WorkoutExercise.mjs';

/**
 * A user-defined workout plan, defined by labels, exercise types, and exercise measurement goals
 */
export default class WorkoutPlan {
    /**
     * @param {String} name
     * @param {Array<WorkoutExercise>} exercises
     */
    constructor(name, exercises) {
        this._name = name;
        this._exercises = exercises || [];
    };

    /**
     * @returns {String}
     */
    getName() {
        return this._name;
    };

    /**
     * @returns {Array<WorkoutExercise>}
     */
    getExercises() {
        return this._exercises;
    };

    /**
     * @param {WorkoutExercise} exercise
     * @throws Error if exercise already exists
     */
    addExercise(exercise) {
        try {
            this.getExercise(exercise.getName());
        } catch (error) {
            this._exercises.push(exercise);
            return;
        }

        throw new Error('Exercise already exists: ' + exercise.getName());
    };

    /**
     * @param {String} name
     * @returns {WorkoutExercise
     */
    getExercise(name) {
        for (let i = 0; i < this._exercises.length; ++i) {
            if (this._exercises[i].getName() === name) {
                return this._exercises[i];
            }
        }

        throw new Error('Exercise does not exist:' + name);
    };
}