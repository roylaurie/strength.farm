'use strict';

import DomVariableValue from "www/js/ext/domview/DomVariableValue.mjs";

/**
 * Maintains a reference to a template node that represents variables.
 */
export default class DomVariablePointer extends DomViewPointer {
    constructor(domNode, view, varName, onModifiedCallback) {
        super(domNode, view);
        this._name = varName;
        this._varValue = null;
        this._onModifiedCallback = onModifiedCallback || null;
    };

    bindValue(value) {
        if (!this._varValue || !(this._varValue instanceof DomVariableValue)) {
            this._varValue = new DomVariableValue(value, this._onModifiedCallback);
            this._onModified(this);
        } else {
            this._varValue.setValue(value);
        }
    };

    bindObjectValue(dataObj, propertyName) {
        this._varValue = new DomVariableValueObject(dataObj, propertyName, this._onModifiedCallback);
        this._onModified(this);
    };

    getVarValue() {
        return this._value;
    };

    getName() {
        return this._name;
    };

    _onModified() {
        if (this._onModifiedCallback !== null) {
            this._onModifiedCallback(this);
        }
    };

    _onVarValueModified(varValue) {
        this._onModified(this);
    };
}