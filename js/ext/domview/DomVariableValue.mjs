'use strict';

export default class DomVariableValue extends IDomVariableValue {
    constructor(value, onModifiedCallback) {
        super();
        this._value = value;
        this._previousValue = value;
        this._onModifiedCallback = onModifiedCallback || null;
    };

    getValue() {
        return this._value;
    };

    modified() {
        return ( this._value !== this._previousValue );
    };

    _onModified() {
        if (this._onModifiedCallback) {
            this._onModifiedCallback(this);
        }
    };

    reset() {
        this._previousValue = this._value;
        this._onModified();
    };

    setValue(value) {
        if (value !== this._value) {
            this._previousValue = this._value;
            this._value = value;
            this._onModified();
            return true;
        }

        return false;
    };
}
