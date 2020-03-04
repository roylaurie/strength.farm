'use strict';

export default class DomVariableValue extends IDomVariableValue {
    constructor(value) {
        super();
        this._value = value;
        this._previousValue = value;
    };

    getValue() {
        return this._value;
    };

    modified() {
        return ( this._value !== this._previousValue );
    };

    reset() {
        this._previousValue = this._value;
    };

    setValue(value) {
        if (value !== this._value) {
            this._previousValue = this._value;
            this._value = value;
            return true;
        }

        return false;
    };
}
