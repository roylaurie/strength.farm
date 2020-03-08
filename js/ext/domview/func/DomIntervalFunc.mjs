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
