'use strict';

/**
 * A definition of a generic form of exercise (push-up, sit-up, run, etc.)
 */
export default class ExerciseType {
    /**
     * @param {String} name
     * @param {String} namePlural
     */
    constructor(name, namePlural) {
        this._name = name;
        this._namePlural = namePlural;
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
}