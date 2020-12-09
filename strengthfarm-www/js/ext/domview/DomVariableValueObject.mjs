'use strict';

export default class DomVariableValueObject extends IDomVariableValue {
    constructor(valueObj, propertyName) {
        super();
        this._valueObj = valueObj;
        this._propertyName = propertyName;
        this._previousValue = this._value[this._propertyName];

    };

    getValue() {
        return this._valueObj[this._propertyName];
    };

    modified() {
        return ( this._valueObj[this._propertyName] !== this._previousValue );
    };

    reset() {
        this._previousValue = this._valueObj[this._propertyName];
    };
}