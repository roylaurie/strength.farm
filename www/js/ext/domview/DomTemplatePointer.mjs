'use strict';

/**
 * Maintains a reference to a template not that represents another template.
 */
export default class DomTemplatePointer {
    constructor(templateNode, template) {
        this._templateNode = templateNode;
        this._template = template;
        this._templates = [];
    };

    getNode() {
        return this._templateNode;
    };

    getTemplate() {
        return this._template;
    };

    addTemplate(template) {
        this._templates.push(template.getTemplate().getName());
    };

    getTemplates() {
        return this._templates;
    };
}