'use strict';

/**
 *
 */
export default class DomViewPointer {
    constructor(view, domNode) {
        this._view = view;
        this._domNode = domNode;
    };

    getNode() {
        return this._domNode;
    };

    getView() {
        return this._view;
    };
}