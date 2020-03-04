'use strict';

/**
 * Maintains a reference to a template node that represents variables.
 */
export default class DomVariablePointer extends DomViewPointer {
    constructor(domNode, view, varName) {
        super(domNode, view);
        this._name = varName;
        this._varValue = new DomVariableValue();
    };

    getVarValue() {
        return this._value;
    };

    getName() {
        return this._name;
    };
}