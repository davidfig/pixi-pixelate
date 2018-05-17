'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PIXI = require('pixi.js');
var Angle = require('yy-angle');

/**
 * pixi-pixelate: a container to create proper pixelated graphics
 */

var Pixelate = function (_PIXI$Container) {
    _inherits(Pixelate, _PIXI$Container);

    function Pixelate() {
        _classCallCheck(this, Pixelate);

        var _this = _possibleConstructorReturn(this, (Pixelate.__proto__ || Object.getPrototypeOf(Pixelate)).call(this));

        _this.cursor = { x: 0, y: 0 };
        _this.tint = 0xffffff;
        _this._lineStyle = { width: 1, tint: 0xffffff, alpha: 1, direction: 'up' };
        _this.cache = [];
        return _this;
    }

    /**
     * clear all graphics
     */


    _createClass(Pixelate, [{
        key: 'clear',
        value: function clear() {
            while (this.children.length) {
                this.cache.push(this.children.pop());
            }
        }

        /**
         * texture to use for sprites (defaults to PIXI.Texture.WHITE)
         * @type {PIXI.Texture}
         */

    }, {
        key: 'getPoint',


        /**
         * creates or gets an old sprite
         * @param {number} tint
         * @param {number} alpha
         * @private
         */
        value: function getPoint(tint, alpha) {
            var point = void 0;
            if (this.cache.length) {
                point = this.addChild(this.cache.pop());
            } else {
                point = this.addChild(new PIXI.Sprite(Pixelate.texture));
            }
            point.tint = typeof tint === 'undefined' ? this._lineStyle.tint : tint;
            point.alpha = typeof alpha === 'undefined' ? this._lineStyle.alpha : alpha;
            return point;
        }

        /**
         * draw a list of points
         * @param {(number[]|PIXI.Point[]|PIXI.PointLike[])} points
         * @param {number} tint
         * @param {number} alpha
         */

    }, {
        key: 'points',
        value: function points(_points, tint, alpha) {
            if (isNaN(_points[0])) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var point = _step.value;

                        this.point(point.x, point.y, tint, alpha);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                for (var i = 0; i < _points.length; i += 2) {
                    this.point(_points[i], _points[i + 1], tint, alpha);
                }
            }
        }

        /**
         * add a point using lineStyle or provided tint and alpha
         * @param {number} x
         * @param {number} y
         * @param {number} [tint]
         * @param {number} [alpha]
         * @returns {Pixelate}
         */

    }, {
        key: 'point',
        value: function point(x, y, tint, alpha) {
            var point = this.getPoint(tint, alpha);
            point.position.set(x, y);
            point.width = point.height = 1;
            return this;
        }

        /**
         * if lineStyle.width > 1 then use this direction to place the next line; center=alternate up and down
         * @typedef {string} LineDirection (up, center, down)
         */

        /**
         * set linestyle for pixelated layer
         * NOTE: width only works for line() for now
         * @param {number} width
         * @param {number} [tint=0xffffff]
         * @param {number} [alpha=1]
         * @param {LineDirection} [direction=up] (up, center, down)
         * @returns {Pixelate}
         */

    }, {
        key: 'lineStyle',
        value: function lineStyle(width, tint, alpha, direction) {
            this._lineStyle.width = width;
            this._lineStyle.tint = typeof tint !== 'undefined' ? tint : 0xffffff;
            this._lineStyle.alpha = typeof alpha !== 'undefined' ? alpha : 1;
            this._lineStyle.direction = direction || 'up';
            return this;
        }

        /**
         * move cursor to this location
         * @param {number} x
         * @param {number} y
         * @returns {Pixelate}
         */

    }, {
        key: 'moveTo',
        value: function moveTo(x, y) {
            this.cursor.x = x;
            this.cursor.y = y;
            return this;
        }

        /**
         * draw a pixelated line between two points and move cursor to the second point
         * @param {number} x0
         * @param {number} y0
         * @param {number} x1
         * @param {number} y1
         * @param {number} [tint]
         * @param {number} [alpha]
         * @param {number} [lineWidth]
         * @param {LineDirection} [lineDirection]
         * @returns {Pixelate}
         */

    }, {
        key: 'line',
        value: function line(x0, y0, x1, y1, tint, alpha, lineWidth, lineDirection) {
            lineWidth = typeof lineWidth === 'undefined' ? this._lineStyle.width : lineWidth;
            lineDirection = lineDirection || this._lineStyle.direction;
            if (lineWidth === 1) {
                this.drawPoints(this.linePoints(x0, y0, x1, y1), tint, alpha);
            } else {
                var points = this.linePoints(x0, y0, x1, y1);
                var angle = Angle.angleTwoPoints(x0, y0, x1, y1) + Math.PI / 2 * (lineDirection === 'up' ? -1 : 1);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                if (lineDirection === 'center') {
                    for (var i = 0; i < lineWidth - 1; i++) {
                        if (i % 2) {
                            var index = i / 2 + 1;
                            this.linePoints(Math.round(x0 + cos * index), Math.round(y0 + sin * index), Math.round(x1 + cos * index), Math.round(y1 + sin * index), points);
                        } else {
                            var _index = Math.floor(i / 2) + 1;
                            this.linePoints(Math.round(x0 - cos * _index), Math.round(y0 - sin * _index), Math.round(x1 + cos * _index), Math.round(y1 - sin * _index), points);
                        }
                    }
                } else {
                    for (var _i = 0; _i < lineWidth; _i++) {
                        this.linePoints(Math.round(x0 + cos * _i), Math.round(y0 + sin * _i), Math.round(x1 + cos * _i), Math.round(y1 + sin * _i), points);
                    }
                }

                this.drawPoints(points, tint, alpha);
            }
            return this;
        }

        /**
         * draw a pixelated line between two points and move cursor to the second point
         * based on https://github.com/madbence/node-bresenham/blob/master/index.js
         * @private
         * @param {number} x0
         * @param {number} y0
         * @param {number} x1
         * @param {number} y1
         * @param {number[]} [points]
         * @returns {number[]}
         */

    }, {
        key: 'linePoints',
        value: function linePoints(x0, y0, x1, y1, points) {
            points = points || [];
            points.push([x0, y0]);
            var dx = x1 - x0;
            var dy = y1 - y0;
            var adx = Math.abs(dx);
            var ady = Math.abs(dy);
            var eps = 0;
            var sx = dx > 0 ? 1 : -1;
            var sy = dy > 0 ? 1 : -1;
            if (adx > ady) {
                for (var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
                    points.push([x, y]);
                    eps += ady;
                    if (eps << 1 >= adx) {
                        y += sy;
                        eps -= adx;
                    }
                }
            } else {
                for (var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
                    points.push([x, y]);
                    eps += adx;
                    if (eps << 1 >= ady) {
                        x += sx;
                        eps -= ady;
                    }
                }
            }
            return points;
        }

        /**
         * create a unique array
         * from https://stackoverflow.com/a/9229821/1955997
         * @private
         * @param {Array} a
         */

    }, {
        key: 'hashUnique',
        value: function hashUnique(a) {
            var seen = {};
            return a.filter(function (item) {
                var key = item[0] + '.' + item[1];
                return seen.hasOwnProperty(key) ? false : seen[key] = true;
            });
        }

        /**
         * draw a set of points, removing duplicates first
         * @private
         * @param {object[]}
         */

    }, {
        key: 'drawPoints',
        value: function drawPoints(points, tint, alpha) {
            points = this.hashUnique(points);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var point = _step2.value;

                    this.point(point[0], point[1], tint, alpha);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /**
         * draw a pixelated line from the cursor position to this position
         * @param {number} x
         * @param {number} y
         * @returns {Pixelate}
         */

    }, {
        key: 'lineTo',
        value: function lineTo(x, y) {
            this.drawPoints(this.linePoints(this.cursor.x, this.cursor.y, x, y));
            this.cursor.x = x;
            this.cursor.y = y;
            return this;
        }

        /**
         * draw a pixelated circle
         * from https://en.wikipedia.org/wiki/Midpoint_circle_algorithm
         * @param {number} x0
         * @param {number} y0
         * @param {number} radius
         * @param {number} [tint]
         * @param {number} [alpha]
         * @returns {Pixelate}
         */

    }, {
        key: 'circle',
        value: function circle(x0, y0, radius, tint, alpha) {
            var points = [];
            var x = radius;
            var y = 0;
            var decisionOver2 = 1 - x; // Decision criterion divided by 2 evaluated at x=r, y=0

            while (x >= y) {
                points.push([x + x0, y + y0]);
                points.push([y + x0, x + y0]);
                points.push([-x + x0, y + y0]);
                points.push([-y + x0, x + y0]);
                points.push([-x + x0, -y + y0]);
                points.push([-y + x0, -x + y0]);
                points.push([x + x0, -y + y0]);
                points.push([y + x0, -x + y0]);
                y++;
                if (decisionOver2 <= 0) {
                    decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
                } else {
                    x--;
                    decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw and fill circle
         * @param {number} x center
         * @param {number} y center
         * @param {number} radius
         * @param {number} tint
         * @param {number} alpha
         */

    }, {
        key: 'circleFill',
        value: function circleFill(x0, y0, radius, tint, alpha) {
            var points = [];
            var x = radius;
            var y = 0;
            var decisionOver2 = 1 - x; // Decision criterion divided by 2 evaluated at x=r, y=0

            while (x >= y) {
                this.rectPoints(-x + x0, y + y0, x * 2 + 1, 1, points);
                this.rectPoints(-y + x0, x + y0, y * 2 + 1, 1, points);
                this.rectPoints(-x + x0, -y + y0, x * 2 + 1, 1, points);
                this.rectPoints(-y + x0, -x + y0, y * 2 + 1, 1, points);
                y++;
                if (decisionOver2 <= 0) {
                    decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
                } else {
                    x--;
                    decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
                }
            }

            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * return an array of points for a rect
         * @private
         * @param {number} x0
         * @param {number} y0
         * @param {number} width
         * @param {number} height
         * @param {number[]} [points]
         * @returns {object[]}
         */

    }, {
        key: 'rectPoints',
        value: function rectPoints(x0, y0, width, height, points) {
            points = points || [];
            for (var y = y0; y < y0 + height; y++) {
                for (var x = x0; x < x0 + width; x++) {
                    points.push([x, y]);
                }
            }
            return points;
        }

        /**
         * draw the outline of a rect
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} tint
         * @param {number} alpha
         * @return {Pixelate}
         */

    }, {
        key: 'rect',
        value: function rect(x, y, width, height, tint, alpha) {
            if (width === 1) {
                var point = this.getPoint(tint, alpha);
                point.position.set(x, y);
                point.width = 1;
                point.height = height;
            } else if (height === 1) {
                var _point = this.getPoint(tint, alpha);
                _point.position.set(x, y);
                _point.width = 1;
                _point.height = 1;
            } else {
                var top = this.getPoint(tint, alpha);
                top.position.set(x, y);
                top.width = width + 1;
                top.height = 1;
                var bottom = this.getPoint(tint, alpha);
                bottom.position.set(x, y + height);
                bottom.width = width + 1;
                bottom.height = 1;
                var left = this.getPoint(tint, alpha);
                left.position.set(x, y + 1);
                left.width = 1;
                left.height = height - 1;
                var right = this.getPoint(tint, alpha);
                right.position.set(x + width, y + 1);
                right.width = 1;
                right.height = height - 1;
            }
            return this;
        }

        /**
         * draw and fill rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} [tint]
         * @param {number} [alpha]
         * @returns {Pixelate}
         */

    }, {
        key: 'rectFill',
        value: function rectFill(x, y, width, height, tint, alpha) {
            var point = this.getPoint(tint, alpha);
            point.position.set(x, y);
            point.width = width + 1;
            point.height = height + 1;
            return this;
        }

        /**
         * draw a pixelated ellipse
         * from http://cfetch.blogspot.tw/2014/01/wap-to-draw-ellipse-using-midpoint.html
         * @param {number} xc center
         * @param {number} yc center
         * @param {number} rx - radius x-axis
         * @param {number} ry - radius y-axis
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'ellipse',
        value: function ellipse(xc, yc, rx, ry, tint, alpha) {
            var points = [];
            var x = 0,
                y = ry;
            var p = ry * ry - rx * rx * ry + rx * rx / 4;
            while (2 * x * ry * ry < 2 * y * rx * rx) {
                points.push([xc + x, yc - y]);
                points.push([xc - x, yc + y]);
                points.push([xc + x, yc + y]);
                points.push([xc - x, yc - y]);

                if (p < 0) {
                    x = x + 1;
                    p = p + 2 * ry * ry * x + ry * ry;
                } else {
                    x = x + 1;
                    y = y - 1;
                    p = p + (2 * ry * ry * x + ry * ry) - 2 * rx * rx * y;
                }
            }
            p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry;
            while (y >= 0) {
                points.push([xc + x, yc - y]);
                points.push([xc - x, yc + y]);
                points.push([xc + x, yc + y]);
                points.push([xc - x, yc - y]);
                if (p > 0) {
                    y = y - 1;
                    p = p - 2 * rx * rx * y + rx * rx;
                } else {
                    y = y - 1;
                    x = x + 1;
                    p = p + 2 * ry * ry * x - 2 * rx * rx * y - rx * rx;
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw and fill ellipse
         * @param {number} xc - x-center
         * @param {number} yc - y-center
         * @param {number} rx - radius x-axis
         * @param {number} ry - radius y-axis
         * @param {number} tint
         * @returns {Pixelate}
         */

    }, {
        key: 'ellipseFill',
        value: function ellipseFill(xc, yc, rx, ry, tint, alpha) {
            var points = [];
            var x = 0,
                y = ry;
            var p = ry * ry - rx * rx * ry + rx * rx / 4;
            while (2 * x * ry * ry < 2 * y * rx * rx) {
                this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points);
                this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points);
                if (p < 0) {
                    x = x + 1;
                    p = p + 2 * ry * ry * x + ry * ry;
                } else {
                    x = x + 1;
                    y = y - 1;
                    p = p + (2 * ry * ry * x + ry * ry) - 2 * rx * rx * y;
                }
            }
            p = (x + 0.5) * (x + 0.5) * ry * ry + (y - 1) * (y - 1) * rx * rx - rx * rx * ry * ry;
            while (y >= 0) {
                this.rectPoints(xc - x, yc - y, x * 2 + 1, 1, points);
                this.rectPoints(xc - x, yc + y, x * 2 + 1, 1, points);
                if (p > 0) {
                    y = y - 1;
                    p = p - 2 * rx * rx * y + rx * rx;
                } else {
                    y = y - 1;
                    x = x + 1;
                    p = p + 2 * ry * ry * x - 2 * rx * rx * y - rx * rx;
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw a pixelated polygon
         * @param {number[]} vertices
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'polygon',
        value: function polygon(vertices, tint, alpha) {
            var points = [];
            for (var i = 2; i < vertices.length; i += 2) {
                this.linePoints(vertices[i - 2], vertices[i - 1], vertices[i], vertices[i + 1], points);
            }
            if (vertices[vertices.length - 2] !== vertices[0] || vertices[vertices.length - 1] !== vertices[1]) {
                this.linePoints(vertices[vertices.length - 2], vertices[vertices.length - 1], vertices[0], vertices[1], points);
            }
            this.drawPoints(points, tint, alpha);
        }

        /**
         * draw and fill pixelated polygon
         * @param {number[]} vertices
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'polygonFill',
        value: function polygonFill(vertices, tint, alpha) {
            function mod(n, m) {
                return (n % m + m) % m;
            }

            var points = [];
            var edges = [],
                active = [];
            var minY = Infinity,
                maxY = 0;

            for (var i = 0; i < vertices.length; i += 2) {
                var p1 = { x: vertices[i], y: vertices[i + 1] };
                var p2 = { x: vertices[mod(i + 2, vertices.length)], y: vertices[mod(i + 3, vertices.length)] };
                if (p1.y - p2.y !== 0) {
                    var edge = {};
                    edge.p1 = p1;
                    edge.p2 = p2;
                    if (p1.y < p2.y) {
                        edge.minY = p1.y;
                        edge.minX = p1.x;
                    } else {
                        edge.minY = p2.y;
                        edge.minX = p2.x;
                    }
                    minY = edge.minY < minY ? edge.minY : minY;
                    edge.maxY = Math.max(p1.y, p2.y);
                    maxY = edge.maxY > maxY ? edge.maxY : maxY;
                    if (p1.x - p2.x === 0) {
                        edge.slope = Infinity;
                        edge.b = p1.x;
                    } else {
                        edge.slope = (p1.y - p2.y) / (p1.x - p2.x);
                        edge.b = p1.y - edge.slope * p1.x;
                    }
                    edges.push(edge);
                }
            }
            edges.sort(function (a, b) {
                return a.minY - b.minY;
            });
            for (var y = minY; y <= maxY; y++) {
                for (var _i2 = 0; _i2 < edges.length; _i2++) {
                    var _edge = edges[_i2];
                    if (_edge.minY === y) {
                        active.push(_edge);
                        edges.splice(_i2, 1);
                        _i2--;
                    }
                }
                for (var _i3 = 0; _i3 < active.length; _i3++) {
                    var _edge2 = active[_i3];
                    if (_edge2.maxY < y) {
                        active.splice(_i3, 1);
                        _i3--;
                    } else {
                        if (_edge2.slope !== Infinity) {
                            _edge2.x = Math.round((y - _edge2.b) / _edge2.slope);
                        } else {
                            _edge2.x = _edge2.b;
                        }
                    }
                }
                active.sort(function (a, b) {
                    return a.x - b.x === 0 ? b.maxY - a.maxY : a.x - b.x;
                });
                var bit = true,
                    current = 1;
                for (var x = active[0].x; x <= active[active.length - 1].x; x++) {
                    if (bit) {
                        points.push([x, y]);
                    }
                    if (active[current].x === x) {
                        if (active[current].maxY !== y) {
                            bit = !bit;
                        }
                        current++;
                    }
                }
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * draw arc
         * @param {number} x0 - x-start
         * @param {number} y0 - y-start
         * @param {number} radius - radius
         * @param {number} start angle (radians)
         * @param {number} end angle (radians)
         * @param {number} tint
         * @param {number} alpha
         * @returns {Pixelate}
         */

    }, {
        key: 'arc',
        value: function arc(x0, y0, radius, start, end, tint, alpha) {
            var interval = Math.PI / radius / 4;
            var points = [];
            for (var i = start; i <= end; i += interval) {
                points.push([Math.floor(x0 + Math.cos(i) * radius), Math.floor(y0 + Math.sin(i) * radius)]);
            }
            this.drawPoints(points, tint, alpha);
            return this;
        }

        /**
         * empties cache of old sprites
         */

    }, {
        key: 'flush',
        value: function flush() {
            this.cache = [];
        }
    }], [{
        key: 'texture',
        get: function get() {
            return Pixelate._texture;
        },
        set: function set(value) {
            Pixelate._texture = value;
        }
    }]);

    return Pixelate;
}(PIXI.Container);

Pixelate._texture = PIXI.Texture.WHITE;

module.exports = Pixelate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXhlbGF0ZS5qcyJdLCJuYW1lcyI6WyJQSVhJIiwicmVxdWlyZSIsIkFuZ2xlIiwiUGl4ZWxhdGUiLCJjdXJzb3IiLCJ4IiwieSIsInRpbnQiLCJfbGluZVN0eWxlIiwid2lkdGgiLCJhbHBoYSIsImRpcmVjdGlvbiIsImNhY2hlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJwdXNoIiwicG9wIiwicG9pbnQiLCJhZGRDaGlsZCIsIlNwcml0ZSIsInRleHR1cmUiLCJwb2ludHMiLCJpc05hTiIsImkiLCJnZXRQb2ludCIsInBvc2l0aW9uIiwic2V0IiwiaGVpZ2h0IiwieDAiLCJ5MCIsIngxIiwieTEiLCJsaW5lV2lkdGgiLCJsaW5lRGlyZWN0aW9uIiwiZHJhd1BvaW50cyIsImxpbmVQb2ludHMiLCJhbmdsZSIsImFuZ2xlVHdvUG9pbnRzIiwiTWF0aCIsIlBJIiwiY29zIiwic2luIiwiaW5kZXgiLCJyb3VuZCIsImZsb29yIiwiZHgiLCJkeSIsImFkeCIsImFicyIsImFkeSIsImVwcyIsInN4Iiwic3kiLCJhIiwic2VlbiIsImZpbHRlciIsIml0ZW0iLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImhhc2hVbmlxdWUiLCJyYWRpdXMiLCJkZWNpc2lvbk92ZXIyIiwicmVjdFBvaW50cyIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJyaWdodCIsInhjIiwieWMiLCJyeCIsInJ5IiwicCIsInZlcnRpY2VzIiwibW9kIiwibiIsIm0iLCJlZGdlcyIsImFjdGl2ZSIsIm1pblkiLCJJbmZpbml0eSIsIm1heFkiLCJwMSIsInAyIiwiZWRnZSIsIm1pblgiLCJtYXgiLCJzbG9wZSIsImIiLCJzb3J0Iiwic3BsaWNlIiwiYml0IiwiY3VycmVudCIsInN0YXJ0IiwiZW5kIiwiaW50ZXJ2YWwiLCJfdGV4dHVyZSIsInZhbHVlIiwiQ29udGFpbmVyIiwiVGV4dHVyZSIsIldISVRFIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFB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QUFLQyxFQUFMLEdBQVVxQixNQUFWLEdBQW1CLENBQXBDO0FBQ0EsZ0JBQU12QyxTQUFTLEVBQWY7QUFDQSxpQkFBSyxJQUFJRSxJQUFJcUUsS0FBYixFQUFvQnJFLEtBQUtzRSxHQUF6QixFQUE4QnRFLEtBQUt1RSxRQUFuQyxFQUNBO0FBQ0l6RSx1QkFBT04sSUFBUCxDQUFZLENBQUN1QixLQUFLTSxLQUFMLENBQVdoQixLQUFLVSxLQUFLRSxHQUFMLENBQVNqQixDQUFULElBQWNxQyxNQUE5QixDQUFELEVBQXdDdEIsS0FBS00sS0FBTCxDQUFXZixLQUFLUyxLQUFLRyxHQUFMLENBQVNsQixDQUFULElBQWNxQyxNQUE5QixDQUF4QyxDQUFaO0FBQ0g7QUFDRCxpQkFBSzFCLFVBQUwsQ0FBZ0JiLE1BQWhCLEVBQXdCZCxJQUF4QixFQUE4QkcsS0FBOUI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7OztnQ0FJQTtBQUNJLGlCQUFLRSxLQUFMLEdBQWEsRUFBYjtBQUNIOzs7NEJBanJCRDtBQUNJLG1CQUFPVCxTQUFTNEYsUUFBaEI7QUFDSCxTOzBCQUNrQkMsSyxFQUNuQjtBQUNJN0YscUJBQVM0RixRQUFULEdBQW9CQyxLQUFwQjtBQUNIOzs7O0VBakNrQmhHLEtBQUtpRyxTOztBQStzQjVCOUYsU0FBUzRGLFFBQVQsR0FBb0IvRixLQUFLa0csT0FBTCxDQUFhQyxLQUFqQzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQmxHLFFBQWpCIiwiZmlsZSI6InBpeGVsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUElYSSA9IHJlcXVpcmUoJ3BpeGkuanMnKVxyXG5jb25zdCBBbmdsZSA9IHJlcXVpcmUoJ3l5LWFuZ2xlJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLXBpeGVsYXRlOiBhIGNvbnRhaW5lciB0byBjcmVhdGUgcHJvcGVyIHBpeGVsYXRlZCBncmFwaGljc1xyXG4gKi9cclxuY2xhc3MgUGl4ZWxhdGUgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuY3Vyc29yID0geyB4OiAwLCB5OiAwIH1cclxuICAgICAgICB0aGlzLnRpbnQgPSAweGZmZmZmZlxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZSA9IHsgd2lkdGg6IDEsIHRpbnQ6IDB4ZmZmZmZmLCBhbHBoYTogMSwgZGlyZWN0aW9uOiAndXAnIH1cclxuICAgICAgICB0aGlzLmNhY2hlID0gW11cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNsZWFyIGFsbCBncmFwaGljc1xyXG4gICAgICovXHJcbiAgICBjbGVhcigpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHRoaXMuY2hpbGRyZW4ucG9wKCkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogdGV4dHVyZSB0byB1c2UgZm9yIHNwcml0ZXMgKGRlZmF1bHRzIHRvIFBJWEkuVGV4dHVyZS5XSElURSlcclxuICAgICAqIEB0eXBlIHtQSVhJLlRleHR1cmV9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgdGV4dHVyZSgpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFBpeGVsYXRlLl90ZXh0dXJlXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgc2V0IHRleHR1cmUodmFsdWUpXHJcbiAgICB7XHJcbiAgICAgICAgUGl4ZWxhdGUuX3RleHR1cmUgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlcyBvciBnZXRzIGFuIG9sZCBzcHJpdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBwb2ludFxyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcy5hZGRDaGlsZCh0aGlzLmNhY2hlLnBvcCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludCA9IHRoaXMuYWRkQ2hpbGQobmV3IFBJWEkuU3ByaXRlKFBpeGVsYXRlLnRleHR1cmUpKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwb2ludC50aW50ID0gdHlwZW9mIHRpbnQgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLnRpbnQgOiB0aW50XHJcbiAgICAgICAgcG9pbnQuYWxwaGEgPSB0eXBlb2YgYWxwaGEgPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLmFscGhhIDogYWxwaGFcclxuICAgICAgICByZXR1cm4gcG9pbnRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBsaXN0IG9mIHBvaW50c1xyXG4gICAgICogQHBhcmFtIHsobnVtYmVyW118UElYSS5Qb2ludFtdfFBJWEkuUG9pbnRMaWtlW10pfSBwb2ludHNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqL1xyXG4gICAgcG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHBvaW50c1swXSkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnQueCwgcG9pbnQueSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCB0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHBvaW50IHVzaW5nIGxpbmVTdHlsZSBvciBwcm92aWRlZCB0aW50IGFuZCBhbHBoYVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBwb2ludCh4LCB5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgcG9pbnQud2lkdGggPSBwb2ludC5oZWlnaHQgPSAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGlmIGxpbmVTdHlsZS53aWR0aCA+IDEgdGhlbiB1c2UgdGhpcyBkaXJlY3Rpb24gdG8gcGxhY2UgdGhlIG5leHQgbGluZTsgY2VudGVyPWFsdGVybmF0ZSB1cCBhbmQgZG93blxyXG4gICAgICogQHR5cGVkZWYge3N0cmluZ30gTGluZURpcmVjdGlvbiAodXAsIGNlbnRlciwgZG93bilcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2V0IGxpbmVzdHlsZSBmb3IgcGl4ZWxhdGVkIGxheWVyXHJcbiAgICAgKiBOT1RFOiB3aWR0aCBvbmx5IHdvcmtzIGZvciBsaW5lKCkgZm9yIG5vd1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnQ9MHhmZmZmZmZdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhPTFdXHJcbiAgICAgKiBAcGFyYW0ge0xpbmVEaXJlY3Rpb259IFtkaXJlY3Rpb249dXBdICh1cCwgY2VudGVyLCBkb3duKVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lU3R5bGUod2lkdGgsIHRpbnQsIGFscGhhLCBkaXJlY3Rpb24pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLndpZHRoID0gd2lkdGhcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUudGludCA9IHR5cGVvZiB0aW50ICE9PSAndW5kZWZpbmVkJyA/IHRpbnQgOiAweGZmZmZmZlxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZS5hbHBoYSA9IHR5cGVvZiBhbHBoYSAhPT0gJ3VuZGVmaW5lZCcgPyBhbHBoYSA6IDFcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUuZGlyZWN0aW9uID0gZGlyZWN0aW9uIHx8ICd1cCdcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbW92ZSBjdXJzb3IgdG8gdGhpcyBsb2NhdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIG1vdmVUbyh4LCB5KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY3Vyc29yLnggPSB4XHJcbiAgICAgICAgdGhpcy5jdXJzb3IueSA9IHlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBhbmQgbW92ZSBjdXJzb3IgdG8gdGhlIHNlY29uZCBwb2ludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtsaW5lV2lkdGhdXHJcbiAgICAgKiBAcGFyYW0ge0xpbmVEaXJlY3Rpb259IFtsaW5lRGlyZWN0aW9uXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lKHgwLCB5MCwgeDEsIHkxLCB0aW50LCBhbHBoYSwgbGluZVdpZHRoLCBsaW5lRGlyZWN0aW9uKVxyXG4gICAge1xyXG4gICAgICAgIGxpbmVXaWR0aCA9IHR5cGVvZiBsaW5lV2lkdGggPT09ICd1bmRlZmluZWQnID8gdGhpcy5fbGluZVN0eWxlLndpZHRoIDogbGluZVdpZHRoXHJcbiAgICAgICAgbGluZURpcmVjdGlvbiA9IGxpbmVEaXJlY3Rpb24gfHwgdGhpcy5fbGluZVN0eWxlLmRpcmVjdGlvblxyXG4gICAgICAgIGlmIChsaW5lV2lkdGggPT09IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdQb2ludHModGhpcy5saW5lUG9pbnRzKHgwLCB5MCwgeDEsIHkxKSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IHRoaXMubGluZVBvaW50cyh4MCwgeTAsIHgxLCB5MSlcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBBbmdsZS5hbmdsZVR3b1BvaW50cyh4MCwgeTAsIHgxLCB5MSkgKyBNYXRoLlBJIC8gMiAqIChsaW5lRGlyZWN0aW9uID09PSAndXAnID8gLTEgOiAxKVxyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZSlcclxuICAgICAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpXHJcbiAgICAgICAgICAgIGlmIChsaW5lRGlyZWN0aW9uID09PSAnY2VudGVyJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lV2lkdGggLSAxOyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgJSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpIC8gMiArIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKE1hdGgucm91bmQoeDAgKyBjb3MgKiBpbmRleCksIE1hdGgucm91bmQoeTAgKyBzaW4gKiBpbmRleCksIE1hdGgucm91bmQoeDEgKyBjb3MgKiBpbmRleCksIE1hdGgucm91bmQoeTEgKyBzaW4gKiBpbmRleCksIHBvaW50cylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKGkgLyAyKSArIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKE1hdGgucm91bmQoeDAgLSBjb3MgKiBpbmRleCksIE1hdGgucm91bmQoeTAgLSBzaW4gKiBpbmRleCksIE1hdGgucm91bmQoeDEgKyBjb3MgKiBpbmRleCksIE1hdGgucm91bmQoeTEgLSBzaW4gKiBpbmRleCksIHBvaW50cylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVXaWR0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZVBvaW50cyhNYXRoLnJvdW5kKHgwICsgY29zICogaSksIE1hdGgucm91bmQoeTAgKyBzaW4gKiBpKSwgTWF0aC5yb3VuZCh4MSArIGNvcyAqIGkpLCBNYXRoLnJvdW5kKHkxICsgc2luICogaSksIHBvaW50cylcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIGFuZCBtb3ZlIGN1cnNvciB0byB0aGUgc2Vjb25kIHBvaW50XHJcbiAgICAgKiBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWFkYmVuY2Uvbm9kZS1icmVzZW5oYW0vYmxvYi9tYXN0ZXIvaW5kZXguanNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IFtwb2ludHNdXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119XHJcbiAgICAgKi9cclxuICAgIGxpbmVQb2ludHMoeDAsIHkwLCB4MSwgeTEsIHBvaW50cylcclxuICAgIHtcclxuICAgICAgICBwb2ludHMgPSBwb2ludHMgfHwgW11cclxuICAgICAgICBwb2ludHMucHVzaChbeDAsIHkwXSlcclxuICAgICAgICB2YXIgZHggPSB4MSAtIHgwO1xyXG4gICAgICAgIHZhciBkeSA9IHkxIC0geTA7XHJcbiAgICAgICAgdmFyIGFkeCA9IE1hdGguYWJzKGR4KTtcclxuICAgICAgICB2YXIgYWR5ID0gTWF0aC5hYnMoZHkpO1xyXG4gICAgICAgIHZhciBlcHMgPSAwO1xyXG4gICAgICAgIHZhciBzeCA9IGR4ID4gMCA/IDEgOiAtMTtcclxuICAgICAgICB2YXIgc3kgPSBkeSA+IDAgPyAxIDogLTE7XHJcbiAgICAgICAgaWYgKGFkeCA+IGFkeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSB4MCwgeSA9IHkwOyBzeCA8IDAgPyB4ID49IHgxIDogeCA8PSB4MTsgeCArPSBzeClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICAgICAgZXBzICs9IGFkeTtcclxuICAgICAgICAgICAgICAgIGlmICgoZXBzIDw8IDEpID49IGFkeClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB5ICs9IHN5O1xyXG4gICAgICAgICAgICAgICAgICAgIGVwcyAtPSBhZHg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSB4MCwgeSA9IHkwOyBzeSA8IDAgPyB5ID49IHkxIDogeSA8PSB5MTsgeSArPSBzeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICAgICAgZXBzICs9IGFkeDtcclxuICAgICAgICAgICAgICAgIGlmICgoZXBzIDw8IDEpID49IGFkeSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB4ICs9IHN4O1xyXG4gICAgICAgICAgICAgICAgICAgIGVwcyAtPSBhZHk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBvaW50c1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY3JlYXRlIGEgdW5pcXVlIGFycmF5XHJcbiAgICAgKiBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MjI5ODIxLzE5NTU5OTdcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhXHJcbiAgICAgKi9cclxuICAgIGhhc2hVbmlxdWUoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBzZWVuID0ge31cclxuICAgICAgICByZXR1cm4gYS5maWx0ZXIoKGl0ZW0pID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBpdGVtWzBdICsgJy4nICsgaXRlbVsxXVxyXG4gICAgICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrZXkpID8gZmFsc2UgOiAoc2VlbltrZXldID0gdHJ1ZSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHNldCBvZiBwb2ludHMsIHJlbW92aW5nIGR1cGxpY2F0ZXMgZmlyc3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdFtdfVxyXG4gICAgICovXHJcbiAgICBkcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gdGhpcy5oYXNoVW5pcXVlKHBvaW50cylcclxuICAgICAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50KHBvaW50WzBdLCBwb2ludFsxXSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBsaW5lIGZyb20gdGhlIGN1cnNvciBwb3NpdGlvbiB0byB0aGlzIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbGluZVRvKHgsIHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHRoaXMubGluZVBvaW50cyh0aGlzLmN1cnNvci54LCB0aGlzLmN1cnNvci55LCB4LCB5KSlcclxuICAgICAgICB0aGlzLmN1cnNvci54ID0geFxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnkgPSB5XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgY2lyY2xlXHJcbiAgICAgKiBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01pZHBvaW50X2NpcmNsZV9hbGdvcml0aG1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBjaXJjbGUoeDAsIHkwLCByYWRpdXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSByYWRpdXNcclxuICAgICAgICBsZXQgeSA9IDBcclxuICAgICAgICBsZXQgZGVjaXNpb25PdmVyMiA9IDEgLSB4ICAgLy8gRGVjaXNpb24gY3JpdGVyaW9uIGRpdmlkZWQgYnkgMiBldmFsdWF0ZWQgYXQgeD1yLCB5PTBcclxuXHJcbiAgICAgICAgd2hpbGUgKHggPj0geSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4ICsgeDAsIHkgKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt5ICsgeDAsIHggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteCArIHgwLCB5ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXkgKyB4MCwgeCArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy14ICsgeDAsIC15ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXkgKyB4MCwgLXggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4ICsgeDAsIC15ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeSArIHgwLCAteCArIHkwXSlcclxuICAgICAgICAgICAgeSsrXHJcbiAgICAgICAgICAgIGlmIChkZWNpc2lvbk92ZXIyIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqIHkgKyAxIC8vIENoYW5nZSBpbiBkZWNpc2lvbiBjcml0ZXJpb24gZm9yIHkgLT4geSsxXHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4LS1cclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqICh5IC0geCkgKyAxIC8vIENoYW5nZSBmb3IgeSAtPiB5KzEsIHggLT4geC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgY2lyY2xlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICovXHJcbiAgICBjaXJjbGVGaWxsKHgwLCB5MCwgcmFkaXVzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gcmFkaXVzXHJcbiAgICAgICAgbGV0IHkgPSAwXHJcbiAgICAgICAgbGV0IGRlY2lzaW9uT3ZlcjIgPSAxIC0geCAgIC8vIERlY2lzaW9uIGNyaXRlcmlvbiBkaXZpZGVkIGJ5IDIgZXZhbHVhdGVkIGF0IHg9ciwgeT0wXHJcblxyXG4gICAgICAgIHdoaWxlICh4ID49IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXggKyB4MCwgeSArIHkwLCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC15ICsgeDAsIHggKyB5MCwgeSAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteCArIHgwLCAteSArIHkwLCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC15ICsgeDAsIC14ICsgeTAsIHkgKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB5KytcclxuICAgICAgICAgICAgaWYgKGRlY2lzaW9uT3ZlcjIgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogeSArIDEgLy8gQ2hhbmdlIGluIGRlY2lzaW9uIGNyaXRlcmlvbiBmb3IgeSAtPiB5KzFcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHgtLVxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogKHkgLSB4KSArIDEgLy8gQ2hhbmdlIGZvciB5IC0+IHkrMSwgeCAtPiB4LTFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybiBhbiBhcnJheSBvZiBwb2ludHMgZm9yIGEgcmVjdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IFtwb2ludHNdXHJcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0W119XHJcbiAgICAgKi9cclxuICAgIHJlY3RQb2ludHMoeDAsIHkwLCB3aWR0aCwgaGVpZ2h0LCBwb2ludHMpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gcG9pbnRzIHx8IFtdXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IHkwOyB5IDwgeTAgKyBoZWlnaHQ7IHkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB4MDsgeCA8IHgwICsgd2lkdGg7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goW3gsIHldKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwb2ludHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgdGhlIG91dGxpbmUgb2YgYSByZWN0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybiB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHdpZHRoID09PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICAgICAgcG9pbnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHBvaW50LmhlaWdodCA9IGhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoZWlnaHQgPT09IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgICAgICBwb2ludC53aWR0aCA9IDFcclxuICAgICAgICAgICAgcG9pbnQuaGVpZ2h0ID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICB0b3AucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgICAgIHRvcC53aWR0aCA9IHdpZHRoICsgMVxyXG4gICAgICAgICAgICB0b3AuaGVpZ2h0ID0gMVxyXG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBib3R0b20ucG9zaXRpb24uc2V0KHgsIHkgKyBoZWlnaHQpXHJcbiAgICAgICAgICAgIGJvdHRvbS53aWR0aCA9IHdpZHRoICsgMVxyXG4gICAgICAgICAgICBib3R0b20uaGVpZ2h0ID0gMVxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgbGVmdC5wb3NpdGlvbi5zZXQoeCwgeSArIDEpXHJcbiAgICAgICAgICAgIGxlZnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIGxlZnQuaGVpZ2h0ID0gaGVpZ2h0IC0gMVxyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHJpZ2h0LnBvc2l0aW9uLnNldCh4ICsgd2lkdGgsIHkgKyAxKVxyXG4gICAgICAgICAgICByaWdodC53aWR0aCA9IDFcclxuICAgICAgICAgICAgcmlnaHQuaGVpZ2h0ID0gaGVpZ2h0IC0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCByZWN0YW5nbGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbnRdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FscGhhXVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICByZWN0RmlsbCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgcG9pbnQud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICBwb2ludC5oZWlnaHQgPSBoZWlnaHQgKyAxXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgZWxsaXBzZVxyXG4gICAgICogZnJvbSBodHRwOi8vY2ZldGNoLmJsb2dzcG90LnR3LzIwMTQvMDEvd2FwLXRvLWRyYXctZWxsaXBzZS11c2luZy1taWRwb2ludC5odG1sXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geGMgY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWMgY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnggLSByYWRpdXMgeC1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnkgLSByYWRpdXMgeS1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGVsbGlwc2UoeGMsIHljLCByeCwgcnksIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSAwLCB5ID0gcnlcclxuICAgICAgICBsZXQgcCA9IChyeSAqIHJ5KSAtIChyeCAqIHJ4ICogcnkpICsgKChyeCAqIHJ4KSAvIDQpXHJcbiAgICAgICAgd2hpbGUgKCgyICogeCAqIHJ5ICogcnkpIDwgKDIgKiB5ICogcnggKiByeCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyAtIHldKVxyXG5cclxuICAgICAgICAgICAgaWYgKHAgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgKyAocnkgKiByeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHggKyByeSAqIHJ5KSAtICgyICogcnggKiByeCAqIHkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9ICh4ICsgMC41KSAqICh4ICsgMC41KSAqIHJ5ICogcnkgKyAoeSAtIDEpICogKHkgLSAxKSAqIHJ4ICogcnggLSByeCAqIHJ4ICogcnkgKiByeVxyXG4gICAgICAgIHdoaWxlICh5ID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgKyB4LCB5YyArIHldKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeGMgLSB4LCB5YyAtIHldKVxyXG4gICAgICAgICAgICBpZiAocCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgLSAoMiAqIHJ4ICogcnggKiB5KSArIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgLSAoMiAqIHJ4ICogcnggKiB5KSAtIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIGVsbGlwc2VcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4YyAtIHgtY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWMgLSB5LWNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ4IC0gcmFkaXVzIHgtYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ5IC0gcmFkaXVzIHktYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgZWxsaXBzZUZpbGwoeGMsIHljLCByeCwgcnksIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSAwLCB5ID0gcnlcclxuICAgICAgICBsZXQgcCA9IChyeSAqIHJ5KSAtIChyeCAqIHJ4ICogcnkpICsgKChyeCAqIHJ4KSAvIDQpXHJcbiAgICAgICAgd2hpbGUgKCgyICogeCAqIHJ5ICogcnkpIDwgKDIgKiB5ICogcnggKiByeCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyAtIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyArIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICBpZiAocCA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSArIChyeSAqIHJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCArIHJ5ICogcnkpIC0gKDIgKiByeCAqIHJ4ICogeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwID0gKHggKyAwLjUpICogKHggKyAwLjUpICogcnkgKiByeSArICh5IC0gMSkgKiAoeSAtIDEpICogcnggKiByeCAtIHJ4ICogcnggKiByeSAqIHJ5XHJcbiAgICAgICAgd2hpbGUgKHkgPj0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljIC0geSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljICsgeSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIGlmIChwID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCAtICgyICogcnggKiByeCAqIHkpICsgKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSAtICgyICogcnggKiByeCAqIHkpIC0gKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgcG9seWdvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gdmVydGljZXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcG9seWdvbih2ZXJ0aWNlcywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKHZlcnRpY2VzW2kgLSAyXSwgdmVydGljZXNbaSAtIDFdLCB2ZXJ0aWNlc1tpXSwgdmVydGljZXNbaSArIDFdLCBwb2ludHMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAyXSAhPT0gdmVydGljZXNbMF0gfHwgdmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMV0gIT09IHZlcnRpY2VzWzFdKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5saW5lUG9pbnRzKHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDJdLCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXSwgdmVydGljZXNbMF0sIHZlcnRpY2VzWzFdLCBwb2ludHMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCBwaXhlbGF0ZWQgcG9seWdvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gdmVydGljZXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcG9seWdvbkZpbGwodmVydGljZXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGZ1bmN0aW9uIG1vZChuLCBtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuICgobiAlIG0pICsgbSkgJSBtXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGNvbnN0IGVkZ2VzID0gW10sIGFjdGl2ZSA9IFtdXHJcbiAgICAgICAgbGV0IG1pblkgPSBJbmZpbml0eSwgbWF4WSA9IDBcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAxID0geyB4OiB2ZXJ0aWNlc1tpXSwgeTogdmVydGljZXNbaSArIDFdIH1cclxuICAgICAgICAgICAgY29uc3QgcDIgPSB7IHg6IHZlcnRpY2VzW21vZChpICsgMiwgdmVydGljZXMubGVuZ3RoKV0sIHk6IHZlcnRpY2VzW21vZChpICsgMywgdmVydGljZXMubGVuZ3RoKV0gfVxyXG4gICAgICAgICAgICBpZiAocDEueSAtIHAyLnkgIT09IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSB7fVxyXG4gICAgICAgICAgICAgICAgZWRnZS5wMSA9IHAxXHJcbiAgICAgICAgICAgICAgICBlZGdlLnAyID0gcDJcclxuICAgICAgICAgICAgICAgIGlmIChwMS55IDwgcDIueSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblkgPSBwMS55XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5YID0gcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWSA9IHAyLnlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblggPSBwMi54XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtaW5ZID0gKGVkZ2UubWluWSA8IG1pblkpID8gZWRnZS5taW5ZIDogbWluWVxyXG4gICAgICAgICAgICAgICAgZWRnZS5tYXhZID0gTWF0aC5tYXgocDEueSwgcDIueSlcclxuICAgICAgICAgICAgICAgIG1heFkgPSAoZWRnZS5tYXhZID4gbWF4WSkgPyBlZGdlLm1heFkgOiBtYXhZXHJcbiAgICAgICAgICAgICAgICBpZiAocDEueCAtIHAyLnggPT09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5zbG9wZSA9IEluZmluaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5iID0gcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2Uuc2xvcGUgPSAocDEueSAtIHAyLnkpIC8gKHAxLnggLSBwMi54KVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuYiA9IHAxLnkgLSBlZGdlLnNsb3BlICogcDEueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWRnZXMucHVzaChlZGdlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVkZ2VzLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEubWluWSAtIGIubWluWSB9KVxyXG4gICAgICAgIGZvciAobGV0IHkgPSBtaW5ZOyB5IDw9IG1heFk7IHkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWRnZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSBlZGdlc1tpXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVkZ2UubWluWSA9PT0geSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUucHVzaChlZGdlKVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aXZlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0gYWN0aXZlW2ldXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRnZS5tYXhZIDwgeSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgaS0tXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2Uuc2xvcGUgIT09IEluZmluaXR5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZS54ID0gTWF0aC5yb3VuZCgoeSAtIGVkZ2UuYikgLyBlZGdlLnNsb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlLnggPSBlZGdlLmJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWN0aXZlLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEueCAtIGIueCA9PT0gMCA/IGIubWF4WSAtIGEubWF4WSA6IGEueCAtIGIueCB9KVxyXG4gICAgICAgICAgICBsZXQgYml0ID0gdHJ1ZSwgY3VycmVudCA9IDFcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IGFjdGl2ZVswXS54OyB4IDw9IGFjdGl2ZVthY3RpdmUubGVuZ3RoIC0gMV0ueDsgeCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYml0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVbY3VycmVudF0ueCA9PT0geClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlW2N1cnJlbnRdLm1heFkgIT09IHkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiaXQgPSAhYml0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQrK1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFyY1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwIC0geC1zdGFydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwIC0geS1zdGFydFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IGFuZ2xlIChyYWRpYW5zKVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBhbmdsZSAocmFkaWFucylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgYXJjKHgwLCB5MCwgcmFkaXVzLCBzdGFydCwgZW5kLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IE1hdGguUEkgLyByYWRpdXMgLyA0XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpICs9IGludGVydmFsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW01hdGguZmxvb3IoeDAgKyBNYXRoLmNvcyhpKSAqIHJhZGl1cyksIE1hdGguZmxvb3IoeTAgKyBNYXRoLnNpbihpKSAqIHJhZGl1cyldKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZW1wdGllcyBjYWNoZSBvZiBvbGQgc3ByaXRlc1xyXG4gICAgICovXHJcbiAgICBmbHVzaCgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdXHJcbiAgICB9XHJcbn1cclxuXHJcblBpeGVsYXRlLl90ZXh0dXJlID0gUElYSS5UZXh0dXJlLldISVRFXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBpeGVsYXRlIl19