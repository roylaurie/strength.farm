'use strict';

import DomViewPointer from "js/ext/domview/DomViewPointer.mjs";

/**
 * Maintains a reference to a template not that represents another template.
 */
export default class DomTemplatePointerCollection extends DomViewPointer {
    constructor(view, domNode) {
        super(view, domNode);
        this._templatePointers = [];
    };

    getTemplatePointers() {
        return this._templatePointers;
    };

    addTemplatePointer(templatePointer) {
        this._templatePointers.push(templatePointer);
    };
}