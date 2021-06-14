"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCssFromElement = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const getFileContents_1 = require("./getFileContents");
const getPaddingY_1 = require("./parsers/getPaddingY");
const getPaddingX_1 = require("./parsers/getPaddingX");
const parsePadding_1 = require("./parsers/parsePadding");
const parseHeight_1 = require("./parsers/parseHeight");
const getBackgroundColor_1 = require("./parsers/getBackgroundColor");
const parseBackgroundColor_1 = require("./parsers/parseBackgroundColor");
const parseBorderWidth_1 = require("./parsers/parseBorderWidth");
const getBorderColor_1 = require("./parsers/getBorderColor");
const parseBorderColor_1 = require("./parsers/parseBorderColor");
const parseBorderRadius_1 = require("./parsers/parseBorderRadius");
const getShadow_1 = require("./parsers/getShadow");
const parseShadow_1 = require("./parsers/parseShadow");
const errors_1 = require("../../../frameworks/errors/errors");
function parseCssFromElement(layoutElement, textElement, remSize, outputFormatToken, outputFolderTokens) {
    try {
        if (!layoutElement || !remSize || !outputFormatToken || !outputFolderTokens)
            throw new Error(errors_1.ErrorParseCssFromElement);
        const PATH = process.env.IS_TEST ? path.join(`testdata`, `tokens`) : outputFolderTokens;
        const { borderWidths, colors, radii, shadows, spacing } = getFiles(PATH, outputFormatToken);
        let css = `width: 100%;\nbox-sizing: border-box;\nborder: 0;\nborder-style: solid;\n`;
        if (layoutElement.fills && layoutElement.fills.some((fill) => fill['type'] === 'IMAGE'))
            css += `object-fit: cover;\n`;
        let imports = [];
        const padding = calcPadding({ textElement, layoutElement, css, imports, remSize }, spacing);
        css = padding.css;
        imports = padding.imports;
        const height = calcHeight({ layoutElement, css, imports, remSize }, spacing);
        css = height.css;
        imports = height.imports;
        const bgColor = calcBackgroundColor({ layoutElement, css, imports, remSize }, colors);
        css = bgColor.css;
        imports = bgColor.imports;
        const borderWidth = calcBorderWidth({ layoutElement, css, imports, remSize }, borderWidths);
        css = borderWidth.css;
        imports = borderWidth.imports;
        const borderColor = calcBorderColor({ layoutElement, css, imports, remSize }, colors);
        css = borderColor.css;
        imports = borderColor.imports;
        const borderRadius = calcBorderRadius({ layoutElement, css, imports, remSize }, radii);
        css = borderRadius.css;
        imports = borderRadius.imports;
        const shadow = calcShadows({ layoutElement, css, imports, remSize }, shadows);
        css = shadow.css;
        imports = shadow.imports;
        const NEW_CSS = reduceDuplicates(css);
        return { updatedCss: NEW_CSS, updatedImports: imports };
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.parseCssFromElement = parseCssFromElement;
const reduceDuplicates = (str) => Array.from(new Set(str.split(/;/gi)))
    .toString()
    .replace(/,\n/gi, ';\n');
const getFiles = (filePath, outputFormatToken) => {
    try {
        const borderWidths = getFileContents_1.getFileContents(filePath, 'borderWidths', outputFormatToken);
        const colors = getFileContents_1.getFileContents(filePath, 'colors', outputFormatToken);
        const radii = getFileContents_1.getFileContents(filePath, 'radii', outputFormatToken);
        const shadows = getFileContents_1.getFileContents(filePath, 'shadows', outputFormatToken);
        const spacing = getFileContents_1.getFileContents(filePath, 'spacing', outputFormatToken);
        return {
            borderWidths,
            colors,
            radii,
            shadows,
            spacing
        };
    }
    catch (error) {
        throw new Error(error);
    }
};
function calcPadding(calcData, spacing) {
    const { textElement, layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const PADDING_Y = textElement
        ? getPaddingY_1.getPaddingY(textElement, layoutElement)
        : null;
    const PADDING_X = textElement
        ? getPaddingX_1.getPaddingX(textElement, layoutElement)
        : null;
    if (PADDING_Y && PADDING_X) {
        const PADDING = Object.assign(Object.assign({}, PADDING_Y), PADDING_X);
        const PARSED_PADDING = parsePadding_1.parsePadding(css, imports, {
            padding: PADDING,
            spacing,
            remSize
        });
        css += PARSED_PADDING.css;
        if (PARSED_PADDING.imports)
            imports = imports.concat(PARSED_PADDING.imports);
    }
    return { css, imports };
}
function calcHeight(calcData, spacing) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const HEIGHT = layoutElement.absoluteBoundingBox
        ? layoutElement.absoluteBoundingBox.height
        : null;
    if (HEIGHT) {
        const parsedValue = parseHeight_1.parseHeight(css, imports, { spacing, height: HEIGHT, remSize });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
function calcBackgroundColor(calcData, colors) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const BACKGROUND_COLOR = getBackgroundColor_1.getBackgroundColor(layoutElement);
    if (BACKGROUND_COLOR) {
        const parsedValue = parseBackgroundColor_1.parseBackgroundColor(css, imports, {
            colors,
            backgroundColor: BACKGROUND_COLOR,
            remSize
        });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
function calcBorderWidth(calcData, borderWidths) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const BORDER_WIDTH = layoutElement.strokeWeight ? `${layoutElement.strokeWeight}px` : null;
    if (BORDER_WIDTH) {
        const parsedValue = parseBorderWidth_1.parseBorderWidth(css, imports, {
            borderWidths,
            borderWidth: BORDER_WIDTH,
            remSize
        });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
function calcBorderColor(calcData, colors) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const BORDER_COLOR = getBorderColor_1.getBorderColor(layoutElement);
    if (BORDER_COLOR) {
        const parsedValue = parseBorderColor_1.parseBorderColor(css, imports, {
            colors,
            borderColor: BORDER_COLOR,
            remSize
        });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
function calcBorderRadius(calcData, radii) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const BORDER_RADIUS = layoutElement.cornerRadius ? `${layoutElement.cornerRadius}px` : null;
    if (BORDER_RADIUS) {
        const parsedValue = parseBorderRadius_1.parseBorderRadius(css, imports, {
            radii,
            borderRadius: BORDER_RADIUS,
            remSize
        });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
function calcShadows(calcData, shadows) {
    const { layoutElement, remSize } = calcData;
    let { css, imports } = calcData;
    const SHADOW = getShadow_1.getShadow(layoutElement);
    if (SHADOW) {
        const parsedValue = parseShadow_1.parseShadow(css, imports, { shadows, shadow: SHADOW, remSize });
        css += parsedValue.css;
        if (parsedValue.imports)
            imports = imports.concat(parsedValue.imports);
    }
    return { css, imports };
}
//# sourceMappingURL=parseCssFromElement.js.map