'use strict';





class DomTemplateParameter {
    constructor(paramName, dataType, required) {

    };
}

/**
 * Abstract base class for all template functions.
 */
class DomFunction {
    constructor(name, paramSchema) {
        this.name = name;
        this.paramSchema = paramSchema;
    };

    execute(template, funcPointer, params) {

    };

    parseParamString(paramstr) {
        const regex = /(!(\w+):(.*))+/;
    };
}

class DomIntervalFunc extends DomFunction {
    constructor() {
        super('interval', [
            new DomTemplateParameter('on', DomView.NAMEPATH, DomView.REQUIRED),
            new DomTemplateParameter('count', DomView.NUMBER, DomView.REQUIRED)
        ]);
    };

    execute(template, funcPointer, params) {
    };
}



/**
 * Maintains a reference to a template node that represents variables.
 */
class DomVariablePointer {
    constructor(templateNode, name) {
        this._templateNode = templateNode;
        this._name = name;
    };

    getNode() {
        return this._templateNode;
    };

    getName() {
        return this._name;
    };
}

class IDomVariableValue {
    constructor() {}

    getValue = DomViewEngine.ABSTRACT_METHOD;

    modified = DomViewEngine.ABSTRACT_METHOD;

    reset = DomViewEngine.ABSTRACT_METHOD;
}

class DomVariableValue extends IDomVariableValue {
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

class DomVariableValueObject extends IDomVariableValue {
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






