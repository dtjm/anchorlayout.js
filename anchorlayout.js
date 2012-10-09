// anchor.js
// Anchor-based layouts for HTML/CSS/Javascript documents
(function(){
    // Private helper function
    var getComputedStyle = function(el, pseudo) {
        if(window.getComputedStyle) {
            // FF <4 requires 2nd argument to be null
            // https://developer.mozilla.org/en-US/docs/DOM/window.getComputedStyle
            return window.getComputedStyle.call(this, el, pseudo);
        }

        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }

    // Private helper function
    var calculateOffset = function(el, pos) {
        if(pos === "right") {
            return el.offsetLeft + el.offsetWidth;
        } else if (pos === "left") {
            return el.offsetLeft;
        } else if(pos === "bottom") {
            if(el === document.body) return getWindowHeight();
            return el.offsetTop + el.offsetHeight;
        } else if(pos === "top") {
            return el.offsetTop;
        } else if (pos === "horizontalCenter") {
            return (el.offsetWidth/2) + el.offsetLeft;
        } else if (pos === "verticalCenter") {
            return (el.offsetHeight/2) + el.offsetTop;
        }
    };

    // Private helper function
    var calcStylePx = function(el, props) {
        var sum = 0;
        var style = getComputedStyle(el);
        for(var i = 0; i < props.length; i++) {
            var val = parseInt(style.getPropertyValue(props[i]));
            if(!isNaN(val)) {
                sum += val;
            }
        }
        return sum;
    };

    var getWindowHeight = function(){
        //Standards compliant browsers (mozilla/netscape/opera/IE7)
        if (typeof window.innerHeight != 'undefined') {
            return window.innerHeight
        } else if (typeof document.documentElement != 'undefined'
                 && typeof document.documentElement.clientWidth !=
                 'undefined' && document.documentElement.clientWidth != 0) {
            // IE6
            return document.documentElement.clientHeight
        } else {
            //Older IE
            return document.getElementsByTagName('body')[0].clientHeight
        }
    };

    var isChildOf = function(child, parent) {
        return child.parentElement === parent || child.parentNode === parent;
    };

    // Constructor function
    var AnchorLayout = function() {
        this.anchors = [];
        this.isFlowed = false;
    };

    // Helper function
    AnchorLayout.browserNeedsHelp = function() {
        var ua = navigator.userAgent;
        return ua.indexOf("Firefox") !== -1 || ua.indexOf("MSIE") !== -1;
    };

    // Set one side of the source element to line up with one side of the target
    // element. You can only anchor horizontal to horizontal sides and vertical
    // to vertical sides. E.g., bottom to bottom, bottom to top, but not bottom to
    // left.
    AnchorLayout.prototype.anchor = function(sPos, source, tPos, target) {
        if(!source) throw "need a source";
        if(!target) throw "need a target";
        this.anchors.push([sPos, source, tPos, target]);
    };

    // Set the source to be in the same position as the target and the same
    // width and height
    AnchorLayout.prototype.fill = function(source, target) {
        // It HAS to be in this order because the top and left offsets need to
        // be set before the right and bottom anchors set the width and height
        // of the element
        this.anchor("top", source, "top", target);
        this.anchor("left", source, "left", target);
        this.anchor("right", source, "right", target);
        this.anchor("bottom", source, "bottom", target);
    };

    // Set the source to be centered in the center of the target
    AnchorLayout.prototype.centerIn = function(source, target) {
        this.anchor(source, "horizontalCenter", target, "horizontalCenter");
        this.anchor(source, "verticalCenter", target, "verticalCenter");
    };

    AnchorLayout.prototype.reflow = function() {
        this.isFlowed = true;
        var len = this.anchors.length;
        for(var i = 0; i < len; i++) {
            var a = this.anchors[i];
            var sPos = a[0];
            var source = a[1];
            var tPos = a[2];
            var target = a[3];

            source.style.position = "absolute";
            var offset = calculateOffset(target, tPos);
            if(sPos === "left") {
                if(isChildOf(source, target)) {
                    offset -= target.offsetLeft;
                }
                source.style.left = offset + "px";
            } else if (sPos === "right") {
                if(tPos === "left") {
                    var width = offset - source.offsetLeft -
                        calcStylePx(source, ["margin-right", "margin-left"]);
                    if(width < 0) width = 0;
                    source.style.width = width + "px";
                } else if (tPos === "right") {
                    var width = offset - source.offsetLeft -
                        calcStylePx(source, ["margin-left", "margin-right", "border-left-width", "border-right-width", "padding-left", "padding-right"]);
                    if(isChildOf(source, target)) {
                        width -= target.offsetLeft;
                    }
                    if(width < 0) width = 0;
                    source.style.width = width + "px";
                }
            } else if (sPos === "bottom") {
                if(tPos === "top") {
                    var top = offset - source.offsetHeight - calcStylePx(source, ["margin-top", "margin-bottom"]);
                    source.style.top = top + "px";
                } else if (tPos === "bottom") {
                    var height = offset - source.offsetTop -
                        calcStylePx(source, ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom", "margin-bottom"]);
                    if(isChildOf(source, target)) {
                        height -= target.offsetTop;
                    }
                    if(height < 0) height = 0;
                    source.style.height = height + "px";
                }
            } else if (sPos === "top") {
                if(isChildOf(source, target)) {
                    offset -= target.offsetTop;
                }
                if(offset < 0) offset = 0;
                source.style.top = offset + "px";
            } else if (sPos === "horizontalCenter") {
                if(tPos === "horizontalCenter") {
                    source.style.left = offset - (source.offsetWidth/2) + "px";
                }
            } else if (sPos === "verticalCenter") {
                if(tPos === "verticalCenter") {
                    source.style.top = offset - (source.offsetHeight/2) + "px";
                }
            }
        }
    };

    AnchorLayout.prototype.remove = function(el) {
        var newAnchors = [];
        for(var i = 0; i < this.anchors.length; i++) {
            var anchor = this.anchors[i];
            if(anchor[1] !== el && anchor[3] !== el) {
                newAnchors.push(anchor)
            }
        }
        this.anchors = newAnchors;
    };

    // Export to window object
    window.AnchorLayout = AnchorLayout;
})();
