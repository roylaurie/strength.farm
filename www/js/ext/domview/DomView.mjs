'use strict';

import DomVariablePointer from "www/js/ext/domview/DomVariablePointer.mjs";

/**
 * Maintains an offscreen copy of the DOM for a specific template instance.
 * Binds values.
 * Updates onscreen copy of DOM upon refresh().
 */
export default class DomView {
    constructor(engine, template) {
        this._engine = engine;
        this._template = template;
        let tmplDom = template.getDom();
        this._dom = ( tmplDom === engine.document ? engine.document : tmplDom.cloneNode(true) );
        this._templatePointers = {};
        this._varPointers = {};
        this._built = false;

        this._compile();
    }

    _compile() {
        // build template pointers for the offscreen copy of the dom
        this._dom.querySelectorAll('[data-template]').forEach((node) => {
            let templateName = node.getAttribute('data-template');
            this._templatePointers[templateName] = new DomViewTemplatePointer(node, this);
        });

        // build variable pointers for the dom copy
        this._dom.querySelectorAll('[data-tmpl-var]').forEach((node) => {
            let varName = node.getAttribute('data-tmpl-var');
            this._varPointers[varName] = new DomVariablePointer(node, this, varName);
        });
    };

    getTemplate() {
        return this._template;
    };

    bindObject(dataObj) {
        for (let name in this._varPointers) {
            if (typeof dataObj[name] !== 'undefined') {
                this._varPointers[name].bindObjectValue(dataObj, name);
            }
        }

        return this;
    };

    bindValue(varName, value) {
        if (typeof this._varPointers[varName] === 'undefined') {
            throw new Error('View variable does not exist: ' + varName);
        }

        this._varPointers[varName].bindValue(varName, value);
        return this;
    };

    bindValues(values) {
        for (let key in values) {
            if (typeof this._varPointers[key] === 'undefined') {
                continue;
            }

            let value = values[key];
            let varPointer = this._varPointers[key];
            varPointer.bindValue(value);
        }

        return this;
    };

    insertView(viewName) {
        if (this._built) {
            throw new Error('Template already built');
        } else if (typeof this._templatePointers[viewName] === 'undefined') {
            throw new Error('Template ' + viewName + ' does not exist.');
        }

        let templatePointer = this._templatePointers[viewName];
        let view = templatePointer.getView().template();
        templatePointer.addTemplate(template);
        return template;
    };

    display() {
        const stripAttributes = ['data-tmpl-var'];

        // fill variable values
        for (let varName in this._varPointers) {
            let varPointer = this._varPointers[varName];

            // fill any attributes specified
            if (typeof values['attr'] !== 'undefined') {
                for (let name in values['attr']) {
                    node.setAttribute(varName, values['attr'][varName]);
                }
            }

            // fill innerText or innerHTML if specified
            if (typeof values['innerText'] !== 'undefined') {
                node.innerText = values['innerText'];
            } else if (typeof values['innerHTML'] !== 'undefined') {
                node.innerHTML = values['innerHTML'];
            }
        }

        // remove all DomView attributes from offscreen dom copy
        for (let i = 0; i < stripAttributes.length; ++i) {
            const attribute = stripAttributes[i];
            const selector = '[' + attribute + ']';
            this._dom.querySelectorAll(selector).forEach((node) => {
                node.removeAttribute(attribute);
            })
        }

        // build and inject any inline templates
        this._dom.querySelectorAll('[data-template]').forEach((node) => {
            let name = node.getAttribute('data-template');
            let view = this.insertView(name);
            view.build();
            view.inject(node);
        });

        this._built = true;
    };

    inject(domNode) {
        this._dom.childNodes.forEach((node) => {
            domNode.after(this._dom);
        });

        if (domNode.hasAttribute(DomView.TEMPLATE_ATTR)) {
            domNode.remove();
        }

        const name = this._template.getName();
        const cssUri = DomView.CSS_DIR + name + DomView.CSS_EXT;
        if (!DomViewEngine.singleton.isResourceLoaded(name, DomView.CSS)) {
            document.querySelector('head').append(Html.createCssInclude(cssUri));
            DomViewEngine.singleton.markResourceLoaded(name, DomView.CSS, cssUri);
        }
    };
}

DomView.CSS_DIR = 'view/css/';
DomView.HTML_DIR = 'view/html/';
DomView.JS_DIR = 'view/js/;'
DomView.NAMEPATH = 'namepath';
DomView.NUMBER = 'number';
DomView.OPTIONAL = 'optional';
DomView.PARAM_ATTR = 'data-template-param';
DomView.PARAMS_ATTR = 'data-template-params';
DomView.REQUIRED = 'required';
DomView.STRING = 'string';
DomView.TEMPLATE_ATTR = 'data-template';
DomView.TEMPLATE_SELECTOR = '[data-template]';
DomView.VAR_ATTR = 'data-var';
DomView.VAR_SELECTOR = '[data-var]';