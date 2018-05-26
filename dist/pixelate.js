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
     * @returns {Pixelate}
     */


    _createClass(Pixelate, [{
        key: 'clear',
        value: function clear() {
            while (this.children.length) {
                this.cache.push(this.children.pop());
            }
            return this;
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
                var angle = Angle.angleTwoPoints(x0, y0, x1, y1) + Math.PI / 2 * (lineDirection === 'up' ? -1 : 1);
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var points = [];
                if (lineDirection === 'center') {
                    var half = lineWidth / 2;
                    points.push(x0 + Math.round(cos * half), y0 + Math.round(sin * half));
                    points.push(x1 + Math.round(cos * half), y1 + Math.round(sin * half));
                    points.push(x1 - Math.round(cos * half), y1 - Math.round(sin * half));
                    points.push(x0 - Math.round(cos * half), y0 - Math.round(sin * half));
                } else {
                    points.push(x0, y0);
                    points.push(x0 + Math.round(cos * lineWidth), y0 + Math.round(sin * lineWidth));
                    points.push(x1 + Math.round(cos * lineWidth), y1 + Math.round(sin * lineWidth));
                    points.push(x1, y1);
                }
                this.polygonFill(points, tint, alpha, 1);
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
                for (var _i = 0; _i < edges.length; _i++) {
                    var _edge = edges[_i];
                    if (_edge.minY === y) {
                        active.push(_edge);
                        edges.splice(_i, 1);
                        _i--;
                    }
                }
                for (var _i2 = 0; _i2 < active.length; _i2++) {
                    var _edge2 = active[_i2];
                    if (_edge2.maxY < y) {
                        active.splice(_i2, 1);
                        _i2--;
                    } else {
                        if (_edge2.slope !== Infinity) {
                            _edge2.x = Math.round((y - _edge2.b) / _edge2.slope);
                        } else {
                            _edge2.x = _edge2.b;
                        }
                    }
                }
                if (active.length) {
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
                } else {
                    return this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXhlbGF0ZS5qcyJdLCJuYW1lcyI6WyJQSVhJIiwicmVxdWlyZSIsIkFuZ2xlIiwiUGl4ZWxhdGUiLCJjdXJzb3IiLCJ4IiwieSIsInRpbnQiLCJfbGluZVN0eWxlIiwid2lkdGgiLCJhbHBoYSIsImRpcmVjdGlvbiIsImNhY2hlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJwdXNoIiwicG9wIiwicG9pbnQiLCJhZGRDaGlsZCIsIlNwcml0ZSIsInRleHR1cmUiLCJwb2ludHMiLCJpc05hTiIsImkiLCJnZXRQb2ludCIsInBvc2l0aW9uIiwic2V0IiwiaGVpZ2h0IiwieDAiLCJ5MCIsIngxIiwieTEiLCJsaW5lV2lkdGgiLCJsaW5lRGlyZWN0aW9uIiwiZHJhd1BvaW50cyIsImxpbmVQb2ludHMiLCJhbmdsZSIsImFuZ2xlVHdvUG9pbnRzIiwiTWF0aCIsIlBJIiwiY29zIiwic2luIiwiaGFsZiIsInJvdW5kIiwicG9seWdvbkZpbGwiLCJkeCIsImR5IiwiYWR4IiwiYWJzIiwiYWR5IiwiZXBzIiwic3giLCJzeSIsImEiLCJzZWVuIiwiZmlsdGVyIiwiaXRlbSIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFzaFVuaXF1ZSIsInJhZGl1cyIsImRlY2lzaW9uT3ZlcjIiLCJyZWN0UG9pbnRzIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwieGMiLCJ5YyIsInJ4IiwicnkiLCJwIiwidmVydGljZXMiLCJtb2QiLCJuIiwibSIsImVkZ2VzIiwiYWN0aXZlIiwibWluWSIsIkluZmluaXR5IiwibWF4WSIsInAxIiwicDIiLCJlZGdlIiwibWluWCIsIm1heCIsInNsb3BlIiwiYiIsInNvcnQiLCJzcGxpY2UiLCJiaXQiLCJjdXJyZW50Iiwic3RhcnQiLCJlbmQiLCJpbnRlcnZhbCIsImZsb29yIiwiX3RleHR1cmUiLCJ2YWx1ZSIsIkNvbnRhaW5lciIsIlRleHR1cmUiLCJXSElURSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7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RSxRQUFuQyxFQUNBO0FBQ0l6RSx1QkFBT04sSUFBUCxDQUFZLENBQUN1QixLQUFLeUQsS0FBTCxDQUFXbkUsS0FBS1UsS0FBS0UsR0FBTCxDQUFTakIsQ0FBVCxJQUFjcUMsTUFBOUIsQ0FBRCxFQUF3Q3RCLEtBQUt5RCxLQUFMLENBQVdsRSxLQUFLUyxLQUFLRyxHQUFMLENBQVNsQixDQUFULElBQWNxQyxNQUE5QixDQUF4QyxDQUFaO0FBQ0g7QUFDRCxpQkFBSzFCLFVBQUwsQ0FBZ0JiLE1BQWhCLEVBQXdCZCxJQUF4QixFQUE4QkcsS0FBOUI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQ7Ozs7OztnQ0FJQTtBQUNJLGlCQUFLRSxLQUFMLEdBQWEsRUFBYjtBQUNIOzs7NEJBL3FCRDtBQUNJLG1CQUFPVCxTQUFTNkYsUUFBaEI7QUFDSCxTOzBCQUNrQkMsSyxFQUNuQjtBQUNJOUYscUJBQVM2RixRQUFULEdBQW9CQyxLQUFwQjtBQUNIOzs7O0VBbkNrQmpHLEtBQUtrRyxTOztBQStzQjVCL0YsU0FBUzZGLFFBQVQsR0FBb0JoRyxLQUFLbUcsT0FBTCxDQUFhQyxLQUFqQzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQm5HLFFBQWpCIiwiZmlsZSI6InBpeGVsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUElYSSA9IHJlcXVpcmUoJ3BpeGkuanMnKVxyXG5jb25zdCBBbmdsZSA9IHJlcXVpcmUoJ3l5LWFuZ2xlJylcclxuXHJcbi8qKlxyXG4gKiBwaXhpLXBpeGVsYXRlOiBhIGNvbnRhaW5lciB0byBjcmVhdGUgcHJvcGVyIHBpeGVsYXRlZCBncmFwaGljc1xyXG4gKi9cclxuY2xhc3MgUGl4ZWxhdGUgZXh0ZW5kcyBQSVhJLkNvbnRhaW5lclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuY3Vyc29yID0geyB4OiAwLCB5OiAwIH1cclxuICAgICAgICB0aGlzLnRpbnQgPSAweGZmZmZmZlxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZSA9IHsgd2lkdGg6IDEsIHRpbnQ6IDB4ZmZmZmZmLCBhbHBoYTogMSwgZGlyZWN0aW9uOiAndXAnIH1cclxuICAgICAgICB0aGlzLmNhY2hlID0gW11cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNsZWFyIGFsbCBncmFwaGljc1xyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBjbGVhcigpXHJcbiAgICB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHRoaXMuY2hpbGRyZW4ucG9wKCkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB0ZXh0dXJlIHRvIHVzZSBmb3Igc3ByaXRlcyAoZGVmYXVsdHMgdG8gUElYSS5UZXh0dXJlLldISVRFKVxyXG4gICAgICogQHR5cGUge1BJWEkuVGV4dHVyZX1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCB0ZXh0dXJlKClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gUGl4ZWxhdGUuX3RleHR1cmVcclxuICAgIH1cclxuICAgIHN0YXRpYyBzZXQgdGV4dHVyZSh2YWx1ZSlcclxuICAgIHtcclxuICAgICAgICBQaXhlbGF0ZS5fdGV4dHVyZSA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGVzIG9yIGdldHMgYW4gb2xkIHNwcml0ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHBvaW50XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGUubGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnQgPSB0aGlzLmFkZENoaWxkKHRoaXMuY2FjaGUucG9wKCkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50ID0gdGhpcy5hZGRDaGlsZChuZXcgUElYSS5TcHJpdGUoUGl4ZWxhdGUudGV4dHVyZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvaW50LnRpbnQgPSB0eXBlb2YgdGludCA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLl9saW5lU3R5bGUudGludCA6IHRpbnRcclxuICAgICAgICBwb2ludC5hbHBoYSA9IHR5cGVvZiBhbHBoYSA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLl9saW5lU3R5bGUuYWxwaGEgOiBhbHBoYVxyXG4gICAgICAgIHJldHVybiBwb2ludFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIGxpc3Qgb2YgcG9pbnRzXHJcbiAgICAgKiBAcGFyYW0geyhudW1iZXJbXXxQSVhJLlBvaW50W118UElYSS5Qb2ludExpa2VbXSl9IHBvaW50c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICovXHJcbiAgICBwb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBpZiAoaXNOYU4ocG9pbnRzWzBdKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludChwb2ludC54LCBwb2ludC55LCB0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludChwb2ludHNbaV0sIHBvaW50c1tpICsgMV0sIHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGEgcG9pbnQgdXNpbmcgbGluZVN0eWxlIG9yIHByb3ZpZGVkIHRpbnQgYW5kIGFscGhhXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGludF1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYWxwaGFdXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHBvaW50KHgsIHksIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICBwb2ludC53aWR0aCA9IHBvaW50LmhlaWdodCA9IDFcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaWYgbGluZVN0eWxlLndpZHRoID4gMSB0aGVuIHVzZSB0aGlzIGRpcmVjdGlvbiB0byBwbGFjZSB0aGUgbmV4dCBsaW5lOyBjZW50ZXI9YWx0ZXJuYXRlIHVwIGFuZCBkb3duXHJcbiAgICAgKiBAdHlwZWRlZiB7c3RyaW5nfSBMaW5lRGlyZWN0aW9uICh1cCwgY2VudGVyLCBkb3duKVxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZXQgbGluZXN0eWxlIGZvciBwaXhlbGF0ZWQgbGF5ZXJcclxuICAgICAqIE5PVEU6IHdpZHRoIG9ubHkgd29ya3MgZm9yIGxpbmUoKSBmb3Igbm93XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGludD0weGZmZmZmZl1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYWxwaGE9MV1cclxuICAgICAqIEBwYXJhbSB7TGluZURpcmVjdGlvbn0gW2RpcmVjdGlvbj11cF0gKHVwLCBjZW50ZXIsIGRvd24pXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGxpbmVTdHlsZSh3aWR0aCwgdGludCwgYWxwaGEsIGRpcmVjdGlvbilcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUud2lkdGggPSB3aWR0aFxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZS50aW50ID0gdHlwZW9mIHRpbnQgIT09ICd1bmRlZmluZWQnID8gdGludCA6IDB4ZmZmZmZmXHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLmFscGhhID0gdHlwZW9mIGFscGhhICE9PSAndW5kZWZpbmVkJyA/IGFscGhhIDogMVxyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgJ3VwJ1xyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtb3ZlIGN1cnNvciB0byB0aGlzIGxvY2F0aW9uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbW92ZVRvKHgsIHkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jdXJzb3IueCA9IHhcclxuICAgICAgICB0aGlzLmN1cnNvci55ID0geVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIGFuZCBtb3ZlIGN1cnNvciB0byB0aGUgc2Vjb25kIHBvaW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGludF1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYWxwaGFdXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2xpbmVXaWR0aF1cclxuICAgICAqIEBwYXJhbSB7TGluZURpcmVjdGlvbn0gW2xpbmVEaXJlY3Rpb25dXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGxpbmUoeDAsIHkwLCB4MSwgeTEsIHRpbnQsIGFscGhhLCBsaW5lV2lkdGgsIGxpbmVEaXJlY3Rpb24pXHJcbiAgICB7XHJcbiAgICAgICAgbGluZVdpZHRoID0gdHlwZW9mIGxpbmVXaWR0aCA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLl9saW5lU3R5bGUud2lkdGggOiBsaW5lV2lkdGhcclxuICAgICAgICBsaW5lRGlyZWN0aW9uID0gbGluZURpcmVjdGlvbiB8fCB0aGlzLl9saW5lU3R5bGUuZGlyZWN0aW9uXHJcbiAgICAgICAgaWYgKGxpbmVXaWR0aCA9PT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvaW50cyh0aGlzLmxpbmVQb2ludHMoeDAsIHkwLCB4MSwgeTEpLCB0aW50LCBhbHBoYSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBBbmdsZS5hbmdsZVR3b1BvaW50cyh4MCwgeTAsIHgxLCB5MSkgKyBNYXRoLlBJIC8gMiAqIChsaW5lRGlyZWN0aW9uID09PSAndXAnID8gLTEgOiAxKVxyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZSlcclxuICAgICAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpXHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgICAgIGlmIChsaW5lRGlyZWN0aW9uID09PSAnY2VudGVyJylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFsZiA9IGxpbmVXaWR0aCAvIDJcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHgwICsgTWF0aC5yb3VuZChjb3MgKiBoYWxmKSwgeTAgKyBNYXRoLnJvdW5kKHNpbiAqIGhhbGYpKVxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDEgKyBNYXRoLnJvdW5kKGNvcyAqIGhhbGYpLCB5MSArIE1hdGgucm91bmQoc2luICogaGFsZikpXHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSAtIE1hdGgucm91bmQoY29zICogaGFsZiksIHkxIC0gTWF0aC5yb3VuZChzaW4gKiBoYWxmKSlcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHgwIC0gTWF0aC5yb3VuZChjb3MgKiBoYWxmKSwgeTAgLSBNYXRoLnJvdW5kKHNpbiAqIGhhbGYpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDAsIHkwKVxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDAgKyBNYXRoLnJvdW5kKGNvcyAqIGxpbmVXaWR0aCksIHkwICsgTWF0aC5yb3VuZChzaW4gKiBsaW5lV2lkdGgpKVxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDEgKyBNYXRoLnJvdW5kKGNvcyAqIGxpbmVXaWR0aCksIHkxICsgTWF0aC5yb3VuZChzaW4gKiBsaW5lV2lkdGgpKVxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDEsIHkxKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucG9seWdvbkZpbGwocG9pbnRzLCB0aW50LCBhbHBoYSwgMSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgYW5kIG1vdmUgY3Vyc29yIHRvIHRoZSBzZWNvbmQgcG9pbnRcclxuICAgICAqIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRiZW5jZS9ub2RlLWJyZXNlbmhhbS9ibG9iL21hc3Rlci9pbmRleC5qc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gW3BvaW50c11cclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX1cclxuICAgICAqL1xyXG4gICAgbGluZVBvaW50cyh4MCwgeTAsIHgxLCB5MSwgcG9pbnRzKVxyXG4gICAge1xyXG4gICAgICAgIHBvaW50cyA9IHBvaW50cyB8fCBbXVxyXG4gICAgICAgIHBvaW50cy5wdXNoKFt4MCwgeTBdKVxyXG4gICAgICAgIHZhciBkeCA9IHgxIC0geDA7XHJcbiAgICAgICAgdmFyIGR5ID0geTEgLSB5MDtcclxuICAgICAgICB2YXIgYWR4ID0gTWF0aC5hYnMoZHgpO1xyXG4gICAgICAgIHZhciBhZHkgPSBNYXRoLmFicyhkeSk7XHJcbiAgICAgICAgdmFyIGVwcyA9IDA7XHJcbiAgICAgICAgdmFyIHN4ID0gZHggPiAwID8gMSA6IC0xO1xyXG4gICAgICAgIHZhciBzeSA9IGR5ID4gMCA/IDEgOiAtMTtcclxuICAgICAgICBpZiAoYWR4ID4gYWR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IHgwLCB5ID0geTA7IHN4IDwgMCA/IHggPj0geDEgOiB4IDw9IHgxOyB4ICs9IHN4KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgICAgICAgICBlcHMgKz0gYWR5O1xyXG4gICAgICAgICAgICAgICAgaWYgKChlcHMgPDwgMSkgPj0gYWR4KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHkgKz0gc3k7XHJcbiAgICAgICAgICAgICAgICAgICAgZXBzIC09IGFkeDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IHgwLCB5ID0geTA7IHN5IDwgMCA/IHkgPj0geTEgOiB5IDw9IHkxOyB5ICs9IHN5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgICAgICAgICBlcHMgKz0gYWR4O1xyXG4gICAgICAgICAgICAgICAgaWYgKChlcHMgPDwgMSkgPj0gYWR5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHggKz0gc3g7XHJcbiAgICAgICAgICAgICAgICAgICAgZXBzIC09IGFkeTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcG9pbnRzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgYSB1bmlxdWUgYXJyYXlcclxuICAgICAqIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzkyMjk4MjEvMTk1NTk5N1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFcclxuICAgICAqL1xyXG4gICAgaGFzaFVuaXF1ZShhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHNlZW4gPSB7fVxyXG4gICAgICAgIHJldHVybiBhLmZpbHRlcigoaXRlbSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGl0ZW1bMF0gKyAnLicgKyBpdGVtWzFdXHJcbiAgICAgICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGtleSkgPyBmYWxzZSA6IChzZWVuW2tleV0gPSB0cnVlKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgc2V0IG9mIHBvaW50cywgcmVtb3ZpbmcgZHVwbGljYXRlcyBmaXJzdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0W119XHJcbiAgICAgKi9cclxuICAgIGRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBwb2ludHMgPSB0aGlzLmhhc2hVbmlxdWUocG9pbnRzKVxyXG4gICAgICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnQocG9pbnRbMF0sIHBvaW50WzFdLCB0aW50LCBhbHBoYSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGxpbmUgZnJvbSB0aGUgY3Vyc29yIHBvc2l0aW9uIHRvIHRoaXMgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBsaW5lVG8oeCwgeSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRyYXdQb2ludHModGhpcy5saW5lUG9pbnRzKHRoaXMuY3Vyc29yLngsIHRoaXMuY3Vyc29yLnksIHgsIHkpKVxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnggPSB4XHJcbiAgICAgICAgdGhpcy5jdXJzb3IueSA9IHlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBjaXJjbGVcclxuICAgICAqIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTWlkcG9pbnRfY2lyY2xlX2FsZ29yaXRobVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGludF1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYWxwaGFdXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGNpcmNsZSh4MCwgeTAsIHJhZGl1cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBsZXQgeCA9IHJhZGl1c1xyXG4gICAgICAgIGxldCB5ID0gMFxyXG4gICAgICAgIGxldCBkZWNpc2lvbk92ZXIyID0gMSAtIHggICAvLyBEZWNpc2lvbiBjcml0ZXJpb24gZGl2aWRlZCBieSAyIGV2YWx1YXRlZCBhdCB4PXIsIHk9MFxyXG5cclxuICAgICAgICB3aGlsZSAoeCA+PSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3ggKyB4MCwgeSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3kgKyB4MCwgeCArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy14ICsgeDAsIHkgKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteSArIHgwLCB4ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXggKyB4MCwgLXkgKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteSArIHgwLCAteCArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3ggKyB4MCwgLXkgKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt5ICsgeDAsIC14ICsgeTBdKVxyXG4gICAgICAgICAgICB5KytcclxuICAgICAgICAgICAgaWYgKGRlY2lzaW9uT3ZlcjIgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogeSArIDEgLy8gQ2hhbmdlIGluIGRlY2lzaW9uIGNyaXRlcmlvbiBmb3IgeSAtPiB5KzFcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHgtLVxyXG4gICAgICAgICAgICAgICAgZGVjaXNpb25PdmVyMiArPSAyICogKHkgLSB4KSArIDEgLy8gQ2hhbmdlIGZvciB5IC0+IHkrMSwgeCAtPiB4LTFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCBjaXJjbGVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKi9cclxuICAgIGNpcmNsZUZpbGwoeDAsIHkwLCByYWRpdXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgbGV0IHggPSByYWRpdXNcclxuICAgICAgICBsZXQgeSA9IDBcclxuICAgICAgICBsZXQgZGVjaXNpb25PdmVyMiA9IDEgLSB4ICAgLy8gRGVjaXNpb24gY3JpdGVyaW9uIGRpdmlkZWQgYnkgMiBldmFsdWF0ZWQgYXQgeD1yLCB5PTBcclxuXHJcbiAgICAgICAgd2hpbGUgKHggPj0geSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteCArIHgwLCB5ICsgeTAsIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXkgKyB4MCwgeCArIHkwLCB5ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC14ICsgeDAsIC15ICsgeTAsIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXkgKyB4MCwgLXggKyB5MCwgeSAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHkrK1xyXG4gICAgICAgICAgICBpZiAoZGVjaXNpb25PdmVyMiA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiB5ICsgMSAvLyBDaGFuZ2UgaW4gZGVjaXNpb24gY3JpdGVyaW9uIGZvciB5IC0+IHkrMVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeC0tXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiAoeSAtIHgpICsgMSAvLyBDaGFuZ2UgZm9yIHkgLT4geSsxLCB4IC0+IHgtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJuIGFuIGFycmF5IG9mIHBvaW50cyBmb3IgYSByZWN0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJbXX0gW3BvaW50c11cclxuICAgICAqIEByZXR1cm5zIHtvYmplY3RbXX1cclxuICAgICAqL1xyXG4gICAgcmVjdFBvaW50cyh4MCwgeTAsIHdpZHRoLCBoZWlnaHQsIHBvaW50cylcclxuICAgIHtcclxuICAgICAgICBwb2ludHMgPSBwb2ludHMgfHwgW11cclxuICAgICAgICBmb3IgKGxldCB5ID0geTA7IHkgPCB5MCArIGhlaWdodDsgeSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHgwOyB4IDwgeDAgKyB3aWR0aDsgeCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBvaW50c1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyB0aGUgb3V0bGluZSBvZiBhIHJlY3RcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJuIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBpZiAod2lkdGggPT09IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgICAgICBwb2ludC53aWR0aCA9IDFcclxuICAgICAgICAgICAgcG9pbnQuaGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhlaWdodCA9PT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgICAgIHBvaW50LndpZHRoID0gMVxyXG4gICAgICAgICAgICBwb2ludC5oZWlnaHQgPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIHRvcC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICAgICAgdG9wLndpZHRoID0gd2lkdGggKyAxXHJcbiAgICAgICAgICAgIHRvcC5oZWlnaHQgPSAxXHJcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIGJvdHRvbS5wb3NpdGlvbi5zZXQoeCwgeSArIGhlaWdodClcclxuICAgICAgICAgICAgYm90dG9tLndpZHRoID0gd2lkdGggKyAxXHJcbiAgICAgICAgICAgIGJvdHRvbS5oZWlnaHQgPSAxXHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBsZWZ0LnBvc2l0aW9uLnNldCh4LCB5ICsgMSlcclxuICAgICAgICAgICAgbGVmdC53aWR0aCA9IDFcclxuICAgICAgICAgICAgbGVmdC5oZWlnaHQgPSBoZWlnaHQgLSAxXHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgcmlnaHQucG9zaXRpb24uc2V0KHggKyB3aWR0aCwgeSArIDEpXHJcbiAgICAgICAgICAgIHJpZ2h0LndpZHRoID0gMVxyXG4gICAgICAgICAgICByaWdodC5oZWlnaHQgPSBoZWlnaHQgLSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIHJlY3RhbmdsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGludF1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYWxwaGFdXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHJlY3RGaWxsKHgsIHksIHdpZHRoLCBoZWlnaHQsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICBwb2ludC53aWR0aCA9IHdpZHRoICsgMVxyXG4gICAgICAgIHBvaW50LmhlaWdodCA9IGhlaWdodCArIDFcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBlbGxpcHNlXHJcbiAgICAgKiBmcm9tIGh0dHA6Ly9jZmV0Y2guYmxvZ3Nwb3QudHcvMjAxNC8wMS93YXAtdG8tZHJhdy1lbGxpcHNlLXVzaW5nLW1pZHBvaW50Lmh0bWxcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4YyBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5YyBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeCAtIHJhZGl1cyB4LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeSAtIHJhZGl1cyB5LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgZWxsaXBzZSh4YywgeWMsIHJ4LCByeSwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBsZXQgeCA9IDAsIHkgPSByeVxyXG4gICAgICAgIGxldCBwID0gKHJ5ICogcnkpIC0gKHJ4ICogcnggKiByeSkgKyAoKHJ4ICogcngpIC8gNClcclxuICAgICAgICB3aGlsZSAoKDIgKiB4ICogcnkgKiByeSkgPCAoMiAqIHkgKiByeCAqIHJ4KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyArIHgsIHljIC0geV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyAtIHgsIHljICsgeV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyArIHgsIHljICsgeV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyAtIHgsIHljIC0geV0pXHJcblxyXG4gICAgICAgICAgICBpZiAocCA8IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSArIChyeSAqIHJ5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCArIHJ5ICogcnkpIC0gKDIgKiByeCAqIHJ4ICogeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwID0gKHggKyAwLjUpICogKHggKyAwLjUpICogcnkgKiByeSArICh5IC0gMSkgKiAoeSAtIDEpICogcnggKiByeCAtIHJ4ICogcnggKiByeSAqIHJ5XHJcbiAgICAgICAgd2hpbGUgKHkgPj0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyArIHgsIHljIC0geV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyAtIHgsIHljICsgeV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyArIHgsIHljICsgeV0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4YyAtIHgsIHljIC0geV0pXHJcbiAgICAgICAgICAgIGlmIChwID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCAtICgyICogcnggKiByeCAqIHkpICsgKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4KSAtICgyICogcnggKiByeCAqIHkpIC0gKHJ4ICogcngpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgZWxsaXBzZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhjIC0geC1jZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5YyAtIHktY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnggLSByYWRpdXMgeC1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnkgLSByYWRpdXMgeS1heGlzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBlbGxpcHNlRmlsbCh4YywgeWMsIHJ4LCByeSwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBsZXQgeCA9IDAsIHkgPSByeVxyXG4gICAgICAgIGxldCBwID0gKHJ5ICogcnkpIC0gKHJ4ICogcnggKiByeSkgKyAoKHJ4ICogcngpIC8gNClcclxuICAgICAgICB3aGlsZSAoKDIgKiB4ICogcnkgKiByeSkgPCAoMiAqIHkgKiByeCAqIHJ4KSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljIC0geSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cyh4YyAtIHgsIHljICsgeSwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIGlmIChwIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpICsgKHJ5ICogcnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4ICsgcnkgKiByeSkgLSAoMiAqIHJ4ICogcnggKiB5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSAoeCArIDAuNSkgKiAoeCArIDAuNSkgKiByeSAqIHJ5ICsgKHkgLSAxKSAqICh5IC0gMSkgKiByeCAqIHJ4IC0gcnggKiByeCAqIHJ5ICogcnlcclxuICAgICAgICB3aGlsZSAoeSA+PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgLSB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgKyB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgaWYgKHAgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwIC0gKDIgKiByeCAqIHJ4ICogeSkgKyAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpIC0gKDIgKiByeCAqIHJ4ICogeSkgLSAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBwb2x5Z29uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSB2ZXJ0aWNlc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBwb2x5Z29uKHZlcnRpY2VzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxpbmVQb2ludHModmVydGljZXNbaSAtIDJdLCB2ZXJ0aWNlc1tpIC0gMV0sIHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1tpICsgMV0sIHBvaW50cylcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDJdICE9PSB2ZXJ0aWNlc1swXSB8fCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXSAhPT0gdmVydGljZXNbMV0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxpbmVQb2ludHModmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMl0sIHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDFdLCB2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0sIHBvaW50cylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIHBpeGVsYXRlZCBwb2x5Z29uXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSB2ZXJ0aWNlc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBwb2x5Z29uRmlsbCh2ZXJ0aWNlcywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgZnVuY3Rpb24gbW9kKG4sIG0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gKChuICUgbSkgKyBtKSAlIG1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgY29uc3QgZWRnZXMgPSBbXSwgYWN0aXZlID0gW11cclxuICAgICAgICBsZXQgbWluWSA9IEluZmluaXR5LCBtYXhZID0gMFxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSArPSAyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSB7IHg6IHZlcnRpY2VzW2ldLCB5OiB2ZXJ0aWNlc1tpICsgMV0gfVxyXG4gICAgICAgICAgICBjb25zdCBwMiA9IHsgeDogdmVydGljZXNbbW9kKGkgKyAyLCB2ZXJ0aWNlcy5sZW5ndGgpXSwgeTogdmVydGljZXNbbW9kKGkgKyAzLCB2ZXJ0aWNlcy5sZW5ndGgpXSB9XHJcbiAgICAgICAgICAgIGlmIChwMS55IC0gcDIueSAhPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRnZSA9IHt9XHJcbiAgICAgICAgICAgICAgICBlZGdlLnAxID0gcDFcclxuICAgICAgICAgICAgICAgIGVkZ2UucDIgPSBwMlxyXG4gICAgICAgICAgICAgICAgaWYgKHAxLnkgPCBwMi55KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWSA9IHAxLnlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblggPSBwMS54XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5ZID0gcDIueVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWCA9IHAyLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1pblkgPSAoZWRnZS5taW5ZIDwgbWluWSkgPyBlZGdlLm1pblkgOiBtaW5ZXHJcbiAgICAgICAgICAgICAgICBlZGdlLm1heFkgPSBNYXRoLm1heChwMS55LCBwMi55KVxyXG4gICAgICAgICAgICAgICAgbWF4WSA9IChlZGdlLm1heFkgPiBtYXhZKSA/IGVkZ2UubWF4WSA6IG1heFlcclxuICAgICAgICAgICAgICAgIGlmIChwMS54IC0gcDIueCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLnNsb3BlID0gSW5maW5pdHlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLmIgPSBwMS54XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5zbG9wZSA9IChwMS55IC0gcDIueSkgLyAocDEueCAtIHAyLngpXHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5iID0gcDEueSAtIGVkZ2Uuc2xvcGUgKiBwMS54XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKGVkZ2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWRnZXMuc29ydCgoYSwgYikgPT4geyByZXR1cm4gYS5taW5ZIC0gYi5taW5ZIH0pXHJcbiAgICAgICAgZm9yIChsZXQgeSA9IG1pblk7IHkgPD0gbWF4WTsgeSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlZGdlcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRnZSA9IGVkZ2VzW2ldXHJcbiAgICAgICAgICAgICAgICBpZiAoZWRnZS5taW5ZID09PSB5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKGVkZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgaS0tXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmUubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVkZ2UgPSBhY3RpdmVbaV1cclxuICAgICAgICAgICAgICAgIGlmIChlZGdlLm1heFkgPCB5KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICBpLS1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWRnZS5zbG9wZSAhPT0gSW5maW5pdHkpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlLnggPSBNYXRoLnJvdW5kKCh5IC0gZWRnZS5iKSAvIGVkZ2Uuc2xvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2UueCA9IGVkZ2UuYlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYWN0aXZlLmxlbmd0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEueCAtIGIueCA9PT0gMCA/IGIubWF4WSAtIGEubWF4WSA6IGEueCAtIGIueCB9KVxyXG4gICAgICAgICAgICAgICAgbGV0IGJpdCA9IHRydWUsIGN1cnJlbnQgPSAxXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gYWN0aXZlWzBdLng7IHggPD0gYWN0aXZlW2FjdGl2ZS5sZW5ndGggLSAxXS54OyB4KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJpdClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVtjdXJyZW50XS54ID09PSB4KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVtjdXJyZW50XS5tYXhZICE9PSB5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXQgPSAhYml0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCsrXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhcmNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MCAtIHgtc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCAtIHktc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBhbmdsZSAocmFkaWFucylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgYW5nbGUgKHJhZGlhbnMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGFyYyh4MCwgeTAsIHJhZGl1cywgc3RhcnQsIGVuZCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLlBJIC8gcmFkaXVzIC8gNFxyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSArPSBpbnRlcnZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFtNYXRoLmZsb29yKHgwICsgTWF0aC5jb3MoaSkgKiByYWRpdXMpLCBNYXRoLmZsb29yKHkwICsgTWF0aC5zaW4oaSkgKiByYWRpdXMpXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVtcHRpZXMgY2FjaGUgb2Ygb2xkIHNwcml0ZXNcclxuICAgICAqL1xyXG4gICAgZmx1c2goKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXVxyXG4gICAgfVxyXG59XHJcblxyXG5QaXhlbGF0ZS5fdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5XSElURVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaXhlbGF0ZSJdfQ==