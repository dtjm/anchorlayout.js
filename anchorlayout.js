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
        }
    };

    var AnchorLayout = function() {
        this.anchors = [];
    };

    AnchorLayout.prototype.anchor = function(source, sPos, target, tPos) {
        this.anchors.push([source, sPos, target, tPos]);
    }

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
                source.style.left =
                    (offset - source.offsetWidth - 2*parseInt(source.style.marginRight)) + "px";
            } else if (sPos === "bottom") {
                source.style.top = (offset - source.offsetHeight - 2*parseInt(source.style.marginBottom)) + "px";
            } else if (sPos === "top") {
                source.style.top = offset + "px";
            }
        }
    };

    window.AnchorLayout = AnchorLayout;
})();
