'use strict';

/**
 * Maintains an offscreen copy of the DOM for a specific template instance.
 * Binds values.
 * Updates onscreen copy of DOM upon refresh().
 */
export default class DomView {
    constructor(template) {
        let tmplDom = template.getDom();
        this._template = template;
        this._dom = ( tmplDom === document ? document : tmplDom.cloneNode(true) );
        this._templatePointers = {};
        this._varPointers = {};
        this._built = false;

        // build template pointers for the offscreen copy of the dom
        let pointers = template.getTemplatePointers();
        this._dom.querySelectorAll('[data-template]').forEach((node) => {
            let name = node.getAttribute('data-template');
            if (typeof pointers[name] === 'undefined') {
                throw new Error('Unable to find pointer for template ' + name);
            }

            let templatePointer = pointers[name];
            this._templatePointers[name] = new DomTemplatePointer(node, templatePointer.getTemplate());
        });

        // build variable pointers for the dom copy
        this._dom.querySelectorAll('[data-tmpl-var]').forEach((node) => {
            let varName = node.getAttribute('data-tmpl-var');
            this._varPointers[varName] = new DomVariablePointer(node, varName);
        });
    };

    getTemplate() {
        return this._template;
    };

    bindValue(varName, values) {
        // error if the template has already been built or the specified template variable doesn't exist on the template
        if (this._built) {
            throw new Error('Template already built');
        } else if (typeof this._varPointers[varName] === 'undefined') {
            throw new Error('Template variable ' + varName + ' does not exist.');
        }

        let varPointer = this._varPointers[varName];
        let node = varPointer.getNode();

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
    };

    insertTemplate(templateName) {
        if (this._built) {
            throw new Error('Template already built');
        } else if (typeof this._templatePointers[templateName] === 'undefined') {
            throw new Error('Template ' + templateName + ' does not exist.');
        }

        let templatePointer = this._templatePointers[templateName];
        let template = templatePointer.getTemplate().template();
        templatePointer.addTemplate(template);
        return template;
    };

    build() {
        const stripAttributes = ['data-tmpl-var'];

        if (this._built) {
            throw new Error('Template already built.');
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
            let template = this.insertTemplate(name);
            template.build();
            template.inject(node);


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