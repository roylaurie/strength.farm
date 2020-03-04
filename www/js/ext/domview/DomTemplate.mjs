'use strict';

/**
 * Represents an HTML schema definition by document object model, typically loaded by file.
 */
export default class DomTemplate {
    constructor(dom, name, uri, templatePointers) {
        this._dom = dom;
        this._name = name;
        this._uri = uri;
        this._templatePointers = templatePointers;
    };

    getName() {
        return this._name;
    };

    getUri() {
        return this._uri;
    };

    getDom() {
        return this._dom;
    };

    getTemplatePointers() {
        return this._pointers;
    };
}