'use strict';

/**
 * Represents an HTML schema definition by document object model, typically loaded by file.
 */
class DomTemplate {
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

/**
 * Maintains an offscreen copy of the DOM for a specific template instance.
 * Binds values.
 * Updates onscreen copy of DOM upon refresh().
 */
class DomView {
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

class DomTemplateParameter {
    constructor(paramName, dataType, required) {

    };
}

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

class DomIntervalFunc extends DomFunction {
    constructor() {
        super('interval', [
            new DomTemplateParameter('on', DomView.NAMEPATH, DomView.REQUIRED),
            new DomTemplateParameter('count', DomView.NUMBER, DomView.REQUIRED)
        ]);
    };

    execute(template, funcPointer, params) {
    };
}


/**
 * Maintains a reference to a template not that represents another template.
 */
class DomTemplatePointer {
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
    }

    getTemplates() {
        return this._templates;
    }
}

/**
 * Maintains a reference to a template node that represents variables.
 */
class DomVariablePointer {
    constructor(templateNode, name) {
        this._templateNode = templateNode;
        this._name = name;
    };

    getNode() {
        return this._templateNode;
    };

    getName() {
        return this._name;
    };
}

class IDomVariableValue {
    constructor() {}

    getValue = DomViewEngine.ABSTRACT_METHOD;

    modified = DomViewEngine.ABSTRACT_METHOD;

    reset = DomViewEngine.ABSTRACT_METHOD;
}

class DomVariableValue extends IDomVariableValue {
    constructor(value) {
        super();
        this._value = value;
        this._previousValue = value;
    };

    getValue() {
        return this._value;
    };

    modified() {
        return ( this._value !== this._previousValue );
    };

    reset() {
        this._previousValue = this._value;
    };

    setValue(value) {
        if (value !== this._value) {
            this._previousValue = this._value;
            this._value = value;
            return true;
        }

        return false;
    };
}

class DomVariableValueObject extends IDomVariableValue {
    constructor(valueObj, propertyName) {
        super();
        this._valueObj = valueObj;
        this._propertyName = propertyName;
        this._previousValue = this._value[this._propertyName];

    };

    getValue() {
        return this._valueObj[this._propertyName];
    };

    modified() {
        return ( this._valueObj[this._propertyName] !== this._previousValue );
    };

    reset() {
        this._previousValue = this._valueObj[this._propertyName];
    };
}

/**
 * Singleton that allows access to DomView library.
 */
class DomViewEngine {
    constructor() {
        this._cache = {};
        this._resourcesLoaded = {};
    };

    isResourceLoaded(name, resourceType) {
        return (this._resourcesLoaded[name] && this._resourcesLoaded[name][resourceType]);
    };

    markResourceLoaded(name, resourceType, uri) {
        if (!this._resourcesLoaded[name]) {
            this._resourcesLoaded[name] = {};
        }

        this._resourcesLoaded[name][resourceType] = uri;
    }

    init(viewName) {
        DomViewEngine.singleton = this;
        return this._load(document, pageName, pageName + DomView.HTML_EXT);
    };

    get(name) {
        if (!this.loaded(name)) {
           throw new Error('Template not loaded: ' + name);
        }

        return this._cache[name];
    };

    loaded(name) {
        return ( typeof this._cache[name] !== 'undefined' );
    };

    fetch(namepath, uri) {
        if (typeof uri === 'undefined') {
            uri = DomView.HTML_DIR + namepath + Html.HTML_EXT;
        }

        let self = this;
        let promise = new Promise((resolve, reject) => {
            Html.fetchFile(uri, Html.HTML_MIME, Html.DOCUMENT).then((request) => {
                let fragment = document.createDocumentFragment();
                let nodes = request.responseXML.querySelector('body').childNodes.forEach((node) => {
                    fragment.append(node);
                });

                self._load(fragment, name, uri).then((template) => {
                    resolve(template);
                }).catch((error) => {
                    reject(error);
                });
            });
        });

        return promise;
    };

    _load(dom, name, uri) {
        let self = this;
        let promises = [];

        let matches = dom.querySelectorAll(DomView.TEMPLATE_SELECTOR);
        matches.forEach((node) => {
            let name = node.getAttribute(DomView.TEMPLATE_ATTR);
            promises.push(self.loaded(name) ? self.get(name) : self.fetch(name));
        });

        let promise = new Promise((resolve, reject) => {
            Promise.all(promises).then((templates) => {
                let pointers = {};
                matches.forEach((node) => {
                    for (let i = 0; i < templates.length; ++i) {
                        if (templates[i].getName() === node.getAttribute(DomView.TEMPLATE_ATTR)) {
                            let pointer = new DomTemplatePointer(node, templates[i]);
                            pointers[templates[i].getName()] = pointer;
                            break;
                        }
                    }
                });

                let template = new DomTemplate(dom, pointers, name, uri);
                self._cache[name] = template;
                resolve(template);
            }).catch((error) => {
                reject(error);
            });
        });

        return promise;
    };
}

DomViewEngine.ABSTRACT_METHOD = () => { throw new Error('Abstract method'); };

class Html {
    constructor() {
        throw new Error('Cannot instantiate class.');
    }
}

Html.fetchFile = (uri, mimeType, responseType) => {
    const promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200 || request.status === 0) {
                    resolve(request);
                } else {
                    reject('HTTP Status: ' + request.status);
                }
            }
        };

        request.open(DomView.GET, uri, true);
        request.overrideMimeType(mimeType);
        request.responseType = responseType;
        request.send();
    });

    return promise;
};

Html.createCssInclude = (cssUri) => {
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('type', 'text/css');
    linkElement.setAttribute('href', cssUri);
    return linkElement;
};

Html.createJsInclude = (jsUri) => {
    const jsElement = document.createElement('script');
    jsElement.setAttribute('type', 'text/javascript');
    jsElement.setAttribute('src', jsUri);
    return jsElement;
};

Html.CSS = 'css';
Html.CSS_EXT = '.css';
Html.DOCUMENT = 'document';
Html.GET = 'GET';
Html.HTML = 'html';
Html.HTML_EXT = '.html';
Html.HTML_MIME = 'text/html';
Html.INNERTEXT = 'innerText';
Html.INNERHTML = 'innerHTML';
Html.JS = 'js';
Html.JS_EXT = '.js';


