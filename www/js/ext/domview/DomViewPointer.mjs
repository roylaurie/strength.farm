'use strict';

/**
 *
 */
export default class DomViewPointer {
    constructor(domNode, view) {
        this._domNode = domNode;
        this._view = view;
    };

    getNode() {
        return this._domNode;
    };

    getView() {
        return this._view;
    };
}