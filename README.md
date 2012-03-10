anchorlayout.js
===============
Anchor-based layouts inspired by QML

# new AnchorLayout
Constructor

# anchor(src, side, target, side)
Anchors one side of the source element to a side of the target element.
Sides can be one of the following:

- `left`, `right`
- `top`, `bottom`
- `horizontalCenter`
- `verticalCenter`

# fill(src, target)
Makes the source element the same size and position as the target.

# centerIn(source, target)
Centers the `src` element onto target's center without changing the
size of the source element;

# reflow()
This needs to be called every time you want the layout to be
recalculated. Put it in your `window.onresize` callback or some place
like that.

## References
- [Anchor-based layout in QML](http://qt-project.org/doc/qt-4.8/qml-anchor-layout.html)
- [A List Apart - Conflicting Absolute Positions](http://www.alistapart.com/articles/conflictingabsolutepositions)

## License
Copyright (c) 2012 Sam Nguyen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
