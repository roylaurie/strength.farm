'use strict';

import DomViewPointer from "js/ext/domview/DomViewPointer.mjs";

/**
 * Maintains a reference to a template not that represents another template.
 */
export default class DomTemplatePointer extends DomViewPointer {
    constructor(domNode, view) {
        super(domNode, view);
    };
}