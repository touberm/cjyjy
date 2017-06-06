var Gti = {};
Gti.Common = {};

/**
* @target	要计算的元素
* @reference	需要相对哪个元素来计算
*/
Gti.Common.getTop = function (target, reference) {
    reference = reference || window;
    var top = target.offsetTop;
    target = target.offsetParent;
    while (target != null && target != reference) {
        top += (target.offsetTop - target.scrollTop);
        target = target.offsetParent;
    }
    return top;
}

Gti.Common.getLeft = function (target, reference) {
    reference = reference || window;
    var left = target.offsetLeft;
    target = target.offsetParent;
    while (target != null && target != reference) {
        left += (target.offsetLeft - target.scrollLeft);
        target = target.offsetParent;
    }
    return left;
}

Gti.Common.getRight = function (target) {
    return Gti.Common.getLeft(target) + target.offsetWidth;
}

Gti.Common.getBottom = function (target) {
    return Gti.Common.getTop(target) + target.offsetHeight;
}

Gti.Common.getHeight = function (C, A) {
    var E = C.offsetHeight || 0;
    if (A !== true) return E;
    var D = Gti.Common.getBorderWidths(C), B = Gti.Common.getPaddings(C);
    return E - D[0] - D[2] - B[0] - B[2];
}

Gti.Common.getWidth = function (D, B) {
    var A = D.offsetWidth || 0;
    if (B !== true) return A;
    var E = Gti.Common.getBorderWidths(D), C = Gti.Common.getPaddings(D);
    return A - E[1] - E[3] - C[1] - C[3];
}

Gti.Common.getBorderWidths = function (A) {
    return [Gti.Common.parseInt(A.style.borderTopWidth),
    Gti.Common.parseInt(A.style.borderRightWidth),
    Gti.Common.parseInt(A.style.borderBottomWidth),
    Gti.Common.parseInt(A.style.borderLeftWidth)];
}

Gti.Common.getPaddings = function (A) {
    return [Gti.Common.parseInt(A.style.paddingTop),
    Gti.Common.parseInt(A.style.paddingRight),
    Gti.Common.parseInt(A.style.paddingBottom),
    Gti.Common.parseInt(A.style.paddingLeft)];
}

Gti.Common.parseInt = function (A, C) {
    var B = parseInt(A);
    return isNaN(parseInt(A)) ? C || 0 : B;
}

Gti.Common.browser = {};
Gti.Common.browser.IE6 = 0;
Gti.Common.browser.IE7 = 1;
Gti.Common.browser.Mozilla = 2;

Gti.Common.browser.getBrowser = function () {
    if (window.XMLHttpRequest) {
        // Mozilla, Safari,...IE7 
        if (!window.ActiveXObject) {
            // Mozilla, Safari,...
            return Gti.Common.browser.Mozilla;
        } else {
            // IE7
            return Gti.Common.browser.IE7;
        }
    } else {
        return Gti.Common.browser.IE6;
    }
}