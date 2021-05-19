"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSpacingTokens = void 0;
const camelize_1 = require("../../../frameworks/string/camelize");
const normalizeUnits_1 = require("../../../frameworks/string/normalizeUnits");
const errors_1 = require("../../../frameworks/errors/errors");
function makeSpacingTokens(spacingFrame, spacingUnit, remSize) {
    if (!spacingFrame)
        throw new Error(errors_1.ErrorMakeSpacingTokensNoFrame);
    if (!spacingFrame.children)
        throw new Error(errors_1.ErrorMakeSpacingTokensNoChildren);
    if (!spacingUnit || !remSize)
        throw new Error(errors_1.ErrorMakeSpacingTokensNoUnits);
    const spacings = {};
    const TOKENS = spacingFrame.children;
    TOKENS.forEach((item) => makeSpacingToken(item, spacings, spacingUnit, remSize));
    return spacings;
}
exports.makeSpacingTokens = makeSpacingTokens;
function makeSpacingToken(item, spacings, spacingUnit, remSize) {
    const NAME = camelize_1.camelize(item.name);
    if (!item.absoluteBoundingBox || !item.absoluteBoundingBox.width)
        throw new Error(errors_1.ErrorMakeSpacingTokensNoFrame);
    const WIDTH = item.absoluteBoundingBox.width;
    const UNIT = (() => {
        if (spacingUnit === 'px')
            return WIDTH + spacingUnit;
        else
            return normalizeUnits_1.normalizeUnits(WIDTH, 'px', spacingUnit, remSize);
    })();
    spacings[NAME] = UNIT;
}
//# sourceMappingURL=makeSpacingTokens.js.map