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

    var AnchorLayout = function() {
        this.anchors = [];
    };

    AnchorLayout.prototype.anchor = function(source, sPos, target, tPos) {
        this.anchors.push([source, sPos, target, tPos]);
    };

    AnchorLayout.prototype.fill = function(source, target) {
        this.anchor(source, "top", target, "top");
        this.anchor(source, "left", target, "left");
        this.anchor(source, "right", target, "right");
        this.anchor(source, "bottom", target, "bottom");
    };

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
                    source.style.left =
                        (offset - source.offsetWidth - 2*parseInt(source.style.marginRight)) + "px";
                } else if (tPos === "right") {
                    var width = offset - source.offsetLeft - 
                        calcStylePx(source, ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"]);
                    source.style.width = width + "px";
                }
            } else if (sPos === "bottom") {
                if(tPos === "top") {
                    source.style.top = (offset - source.offsetHeight - 2*parseInt(source.style.marginBottom)) + "px";
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

    window.AnchorLayout = AnchorLayout;
})();
