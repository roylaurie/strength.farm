'use strict';

export default class Html {
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

Html.generateId = (prefix) => {
    const prefixStr = ( typeof prefix === 'undefined' ? 'tmpl-' : prefix );
    ++Html._LAST_ID;
    return prefixStr + Html._LAST_ID;
};

Html._LAST_ID = 99;

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