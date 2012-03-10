// anchor.js
// Anchor-based layouts for HTML/CSS/Javascript documents
(function(){
    // Private helper function
    var calculateOffset = function(el, pos) {
        if(pos === "right") {
            return el.offsetLeft + el.offsetWidth;
        } else if (pos === "left") {
            return el.offsetLeft;
        } else if(pos === "bottom") {
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
        for(var i = 0; i < props.length; i++) {
            var val = parseInt(el.style[props[i]]);
            if(!isNaN(val)) {
                sum += val;
            }
        }
        return sum;
    };

    // Constructor function
    var AnchorLayout = function() {
        this.anchors = [];
    };

    // Set one side of the source element to line up with one side of the target
    // element. You can only anchor horizontal to horizontal sides and vertical
    // to vertical sides. E.g., bottom to bottom, bottom to top, but not bottom to
    // left.
    AnchorLayout.prototype.anchor = function(source, sPos, target, tPos) {
        this.anchors.push([source, sPos, target, tPos]);
    };

    // Set the source to be in the same position as the target and the same
    // width and height
    AnchorLayout.prototype.fill = function(source, target) {
        // It HAS to be in this order because the top and left offsets need to
        // be set before the right and bottom anchors set the width and height
        // of the element
        this.anchor(source, "top", target, "top");
        this.anchor(source, "left", target, "left");
        this.anchor(source, "right", target, "right");
        this.anchor(source, "bottom", target, "bottom");
    };

    // Set the source to be centered in the center of the target
    AnchorLayout.prototype.centerIn = function(source, target) {
        this.anchor(source, "horizontalCenter", target, "horizontalCenter");
        this.anchor(source, "verticalCenter", target, "verticalCenter");
    };

    AnchorLayout.prototype.reflow = function() {
        var len = this.anchors.length;
        for(var i = 0; i < len; i++) {
            var a = this.anchors[i];
            var source = a[0];
            var sPos = a[1];
            var target = a[2];
            var tPos = a[3];

            source.style.position = "absolute";
            var offset = calculateOffset(target, tPos);
            if(sPos === "left") {
                source.style.left = offset + "px";
            } else if (sPos === "right") {
                if(tPos === "left") {
                    var left = offset - source.offsetWidth -
                        calcStylePx(source, ["marginRight", "marginLeft"]);
                    source.style.left = left + "px";
                } else if (tPos === "right") {
                    var width = offset - source.offsetLeft -
                        calcStylePx(source, ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"]);
                    source.style.width = width + "px";
                }
            } else if (sPos === "bottom") {
                if(tPos === "top") {
                    var top = offset - source.offsetHeight - calcStylePx(source, ["marginTop", "marginBottom"]);
                    source.style.top = top + "px";
                } else if (tPos === "bottom") {
                    var height = offset - source.offsetTop -
                        calcStylePx(source, ["borderLeftWidth", "borderRightWidth", "paddingTop", "paddingBottom", "marginBottom"]);
                    source.style.height = height + "px";
                }
            } else if (sPos === "top") {
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

    // Export to window object
    window.AnchorLayout = AnchorLayout;
})();
