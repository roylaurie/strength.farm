'use strict';

export default class IDomVariableValue {
    constructor() {}

    getValue = DomViewEngine.ABSTRACT_METHOD;

    modified = DomViewEngine.ABSTRACT_METHOD;

    reset = DomViewEngine.ABSTRACT_METHOD;
}