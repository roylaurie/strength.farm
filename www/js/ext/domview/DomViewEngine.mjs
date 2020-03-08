/**
 * @copyright 2020 Asmov LLC
 */
'use strict';

import Html from 'js/ext/domview/Html.mjs';
import DomView from 'js/ext/domview/DomView.mjs';

/**
 * Singleton that allows access to DomView library.
 */
export default class DomViewEngine {
    constructor(document, window) {
        this.document = document || document;
        this.window = window || window;
        this._templates = {};
        this._resourcesLoaded = {};
        this._view = null;
    };

    resourceLoaded(name, resourceType) {
        return (this._resourcesLoaded[name] && this._resourcesLoaded[name][resourceType]);
    };

    markResourceLoaded(name, resourceType, uri) {
        if (!this._resourcesLoaded[name]) {
            this._resourcesLoaded[name] = {};
        }

        this._resourcesLoaded[name][resourceType] = uri;
    }

    /**
     * @param {String} viewName
     * @param {Map<String, String>?} loadViewNames viewName -> templateUri (or viewName)
     * @returns {Promise<DomView>}
     */
    init(viewName, loadViewNames) {
        if (!this.window.name) {
            this.window.name = Html.generateId('tmpl-');
        }

        DomViewEngine._singletons[this.window.name] = this;

        const self = this;
        const promises = [];

        // load the root view
        let promise = this._load(this.document, viewName, viewName + DomView.HTML_EXT);
        promises.push(promise);

        // load additional views
        if (typeof loadViewNames !== 'undefined') {
            for (let loadViewName in loadViewNames) {
                let loadTemplateUri = loadViewNames[loadViewName];
                if (loadTemplateUri.substr(-5) !== Html.HTML_EXT) {
                    loadTemplateUri = loadTemplateUri + Html.HTML_EXT;
                }

                let promise = self._load(self.document, loadViewName, loadTemplateUri);
                promises.push(promise);
            }
        }

        return Promise.all(promises).then((templates) => {
            let rootTemplate = templates[0];
            self._view = new DomView(self, rootTemplate);
            return self._view;
        });
    };

    getTemplate(name) {
        if (!this.templateLoaded(name)) {
            throw new Error('Template not loaded: ' + name);
        }

            return this._templates[name];
    };

    templateLoaded(name) {
        return ( typeof this._templates[name] !== 'undefined' );
    };

    fetch(namepath, uri) {
        if (typeof uri === 'undefined') {
            uri = DomView.HTML_DIR + namepath + Html.HTML_EXT;
        }

        let self = this;
        let promise = new Promise((resolve, reject) => {
            Html.fetchFile(uri, Html.HTML_MIME, Html.DOCUMENT).then((request) => {
                let fragment = self._document.createDocumentFragment();
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
                            let pointer = new DomViewPointer(node, templates[i]);
                            pointers[templates[i].getName()] = pointer;
                            break;
                        }
                    }
                });

                let template = new DomTemplate(dom, pointers, name, uri);
                self._templates[name] = template;
                resolve(template);
            }).catch((error) => {
                reject(error);
            });
        });

        return promise;
    };
}

DomViewEngine._singletons = {};

DomViewEngine.ABSTRACT_METHOD = () => { throw new Error('Abstract method'); };

DomViewEngine.get = (window) => {
    if (typeof DomViewEngine._singletons[window.name] !== 'undefined') {
        return DomViewEngine._singletons[window.name];
    }

    throw new Error('DomView engine not initialized for window:' + window.name);
};