'use strict';

/**
 * Represents an HTML schema definition by document object model, typically loaded by file.
 */
class DomTemplate {
    constructor(dom, pointers, name, uri) {
        this._dom = dom;
        this._pointers = pointers;
        this._name = name;
        this._uri = uri;
    };

    getName() {
        return this._name;
    };

    getUri() {
        return this._uri;
    };

    template() {
        return new DomView(this);
    };

    _getDom() {
        return this._dom;
    };

    _getTemplatePointers() {
        return this._pointers;
    };
}

/**
 * Maintains an offscreen copy of the DOM for a specific template instance.
 * Binds values.
 * Updates onscreen copy of DOM upon refresh().
 */
class DomView {
    constructor(definition) {
        let tmplDom = definition._getDom();
        this._template = definition;
        this._dom = ( tmplDom === document ? document : tmplDom.cloneNode(true) );
        this._pointers = {};
        this._vars = {};
        this._built = false;

        let pointers = definition._getTemplatePointers();
        this._dom.querySelectorAll('[data-template]').forEach((node) => {
            let name = node.getAttribute('data-template');
            if (typeof pointers[name] === 'undefined') {
                throw new Error('Unable to find pointer for template ' + name);
            }

            let pointer = pointers[name];
            this._pointers[name] = new DomTemplatePointer(node, pointer.getTemplate());
        });

        this._dom.querySelectorAll('[data-tmpl-var]').forEach((node) => {
            let name = node.getAttribute('data-tmpl-var');
            this._vars[name] = new DomTemplateVarPointer(node, name);
        });
    };

    getTemplate() {
        return this._template;
    };

    bind(name, values) {
        if (this._built) {
            throw new Error('Template already built');
        } else if (typeof this._vars[name] === 'undefined') {
            throw new Error('Template variable ' + name + ' does not exist.');
        }

        let pointer = this._vars[name];
        let node = pointer.getNode();

        if (typeof values['attr'] !== 'undefined') {
            for (let name in values['attr']) {
                node.setAttribute(name, values['attr'][name]);
            }
        }

        if (typeof values['innerText'] !== 'undefined') {
            node.innerText = values['innerText'];
        } else if (typeof values['innerHTML'] !== 'undefined') {
            node.innerHTML = values['innerHTML'];
        }
    };

    insertTemplate(name) {
        if (this._built) {
            throw new Error('Template already built');
        } else if (typeof this._pointers[name] === 'undefined') {
            throw new Error('Template ' + name + ' does not exist.');
        }

        let pointer = this._pointers[name];
        let template = pointer.getTemplate().template();
        pointer.addTemplate(template);
        return template;
    };

    build() {
        const stripAttributes = ['data-tmpl-var'];

        if (this._built) {
            throw new Error('Template already built.');
        }

        for (let i = 0; i < stripAttributes.length; ++i) {
            const attribute = stripAttributes[i];
            const selector = '[' + attribute + ']';
            this._dom.querySelectorAll(selector).forEach((node) => {
                node.removeAttribute(attribute);
            })
        }

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
        const cssUri = 'css/' + name + '.css';
        if (!DomViewEngine.singleton.isResourceLoaded(name, 'css')) {
            const doc = new DOMParser().parseFromString('<link rel="stylesheet" type="text/css" href="' + cssUri + '">', 'text/html');
            document.querySelector('head').append(doc.querySelector('head').childNodes[0]);
            DomViewEngine.singleton.markResourceLoaded(name, 'css', cssUri);
        }
    };
}

DomView.CSS = 'css';
DomView.CSS_DIR = 'view/css/';
DomView.CSS_EXT = '.css';
DomView.DOCUMENT = 'document';
DomView.GET = 'GET';
DomView.HTML = 'html';
DomView.HTML_DIR = 'view/html/';
DomView.HTML_EXT = '.html';
DomView.HTML_MIME = 'text/html';
DomView.INNERTEXT = 'innerText';
DomView.INNERHTML = 'innerHTML';
DomView.JS = 'js';
DomView.JS_DIR = 'js/;'
DomView.JS_EXT = '.js';
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
class DomTemplateFunc {
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

class DomTemplateIntervalFunc extends DomTemplateFunc {
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
class DomTemplateVarPointer {
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
            uri = DomView.HTML_DIR + namepath + DomView.HTML_EXT;
        }

        let self = this;
        let promise = new Promise((resolve, reject) => {
            self._fetchFile(uri, DomView.HTML_MIME, DomView.DOCUMENT).then((request) => {
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

    _fetchFile(uri, mimeType, responseType) {
        let promise = new Promise((resolve, reject) => {
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


