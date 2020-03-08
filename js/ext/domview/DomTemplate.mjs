'use strict';

/**
 * Represents an HTML schema definition by document object model, typically loaded by file.
 */
export default class DomTemplate {
    constructor(dom, name, uri) {
        this._dom = dom;
        this._name = name;
        this._uri = uri;
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
}