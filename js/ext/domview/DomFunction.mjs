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