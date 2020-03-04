/**
 * @copyright 2020 Asmov LLC
 */
'use strict';

/**
 * Singleton that allows access to DomView library.
 */
export default class DomViewEngine {
    constructor(window, document) {
        this._window = window;
        this._document = document;
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