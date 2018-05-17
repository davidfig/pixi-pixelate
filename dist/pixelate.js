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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXhlbGF0ZS5qcyJdLCJuYW1lcyI6WyJQSVhJIiwicmVxdWlyZSIsIkFuZ2xlIiwiUGl4ZWxhdGUiLCJjdXJzb3IiLCJ4IiwieSIsInRpbnQiLCJfbGluZVN0eWxlIiwid2lkdGgiLCJhbHBoYSIsImRpcmVjdGlvbiIsImNhY2hlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJwdXNoIiwicG9wIiwicG9pbnQiLCJhZGRDaGlsZCIsIlNwcml0ZSIsInRleHR1cmUiLCJwb2ludHMiLCJpc05hTiIsImkiLCJnZXRQb2ludCIsInBvc2l0aW9uIiwic2V0IiwiaGVpZ2h0IiwieDAiLCJ5MCIsIngxIiwieTEiLCJsaW5lV2lkdGgiLCJsaW5lRGlyZWN0aW9uIiwiZHJhd1BvaW50cyIsImxpbmVQb2ludHMiLCJhbmdsZSIsImFuZ2xlVHdvUG9pbnRzIiwiTWF0aCIsIlBJIiwiY29zIiwic2luIiwiaGFsZiIsInJvdW5kIiwicG9seWdvbkZpbGwiLCJkeCIsImR5IiwiYWR4IiwiYWJzIiwiYWR5IiwiZXBzIiwic3giLCJzeSIsImEiLCJzZWVuIiwiZmlsdGVyIiwiaXRlbSIsImtleSIsImhhc093blByb3BlcnR5IiwiaGFzaFVuaXF1ZSIsInJhZGl1cyIsImRlY2lzaW9uT3ZlcjIiLCJyZWN0UG9pbnRzIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwieGMiLCJ5YyIsInJ4IiwicnkiLCJwIiwidmVydGljZXMiLCJtb2QiLCJuIiwibSIsImVkZ2VzIiwiYWN0aXZlIiwibWluWSIsIkluZmluaXR5IiwibWF4WSIsInAxIiwicDIiLCJlZGdlIiwibWluWCIsIm1heCIsInNsb3BlIiwiYiIsInNvcnQiLCJzcGxpY2UiLCJiaXQiLCJjdXJyZW50Iiwic3RhcnQiLCJlbmQiLCJpbnRlcnZhbCIsImZsb29yIiwiX3RleHR1cmUiLCJ2YWx1ZSIsIkNvbnRhaW5lciIsIlRleHR1cmUiLCJXSElURSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7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LENBQVQsSUFBY3FDLE1BQTlCLENBQUQsRUFBd0N0QixLQUFLeUQsS0FBTCxDQUFXbEUsS0FBS1MsS0FBS0csR0FBTCxDQUFTbEIsQ0FBVCxJQUFjcUMsTUFBOUIsQ0FBeEMsQ0FBWjtBQUNIO0FBQ0QsaUJBQUsxQixVQUFMLENBQWdCYixNQUFoQixFQUF3QmQsSUFBeEIsRUFBOEJHLEtBQTlCO0FBQ0EsbUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7Ozs7Z0NBSUE7QUFDSSxpQkFBS0UsS0FBTCxHQUFhLEVBQWI7QUFDSDs7OzRCQXhxQkQ7QUFDSSxtQkFBT1QsU0FBUzZGLFFBQWhCO0FBQ0gsUzswQkFDa0JDLEssRUFDbkI7QUFDSTlGLHFCQUFTNkYsUUFBVCxHQUFvQkMsS0FBcEI7QUFDSDs7OztFQWpDa0JqRyxLQUFLa0csUzs7QUFzc0I1Qi9GLFNBQVM2RixRQUFULEdBQW9CaEcsS0FBS21HLE9BQUwsQ0FBYUMsS0FBakM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUJuRyxRQUFqQiIsImZpbGUiOiJwaXhlbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFBJWEkgPSByZXF1aXJlKCdwaXhpLmpzJylcclxuY29uc3QgQW5nbGUgPSByZXF1aXJlKCd5eS1hbmdsZScpXHJcblxyXG4vKipcclxuICogcGl4aS1waXhlbGF0ZTogYSBjb250YWluZXIgdG8gY3JlYXRlIHByb3BlciBwaXhlbGF0ZWQgZ3JhcGhpY3NcclxuICovXHJcbmNsYXNzIFBpeGVsYXRlIGV4dGVuZHMgUElYSS5Db250YWluZXJcclxue1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmN1cnNvciA9IHsgeDogMCwgeTogMCB9XHJcbiAgICAgICAgdGhpcy50aW50ID0gMHhmZmZmZmZcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUgPSB7IHdpZHRoOiAxLCB0aW50OiAweGZmZmZmZiwgYWxwaGE6IDEsIGRpcmVjdGlvbjogJ3VwJyB9XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjbGVhciBhbGwgZ3JhcGhpY3NcclxuICAgICAqL1xyXG4gICAgY2xlYXIoKVxyXG4gICAge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmNoaWxkcmVuLmxlbmd0aClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaCh0aGlzLmNoaWxkcmVuLnBvcCgpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRleHR1cmUgdG8gdXNlIGZvciBzcHJpdGVzIChkZWZhdWx0cyB0byBQSVhJLlRleHR1cmUuV0hJVEUpXHJcbiAgICAgKiBAdHlwZSB7UElYSS5UZXh0dXJlfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IHRleHR1cmUoKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBQaXhlbGF0ZS5fdGV4dHVyZVxyXG4gICAgfVxyXG4gICAgc3RhdGljIHNldCB0ZXh0dXJlKHZhbHVlKVxyXG4gICAge1xyXG4gICAgICAgIFBpeGVsYXRlLl90ZXh0dXJlID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZXMgb3IgZ2V0cyBhbiBvbGQgc3ByaXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBnZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBsZXQgcG9pbnRcclxuICAgICAgICBpZiAodGhpcy5jYWNoZS5sZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludCA9IHRoaXMuYWRkQ2hpbGQodGhpcy5jYWNoZS5wb3AoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnQgPSB0aGlzLmFkZENoaWxkKG5ldyBQSVhJLlNwcml0ZShQaXhlbGF0ZS50ZXh0dXJlKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcG9pbnQudGludCA9IHR5cGVvZiB0aW50ID09PSAndW5kZWZpbmVkJyA/IHRoaXMuX2xpbmVTdHlsZS50aW50IDogdGludFxyXG4gICAgICAgIHBvaW50LmFscGhhID0gdHlwZW9mIGFscGhhID09PSAndW5kZWZpbmVkJyA/IHRoaXMuX2xpbmVTdHlsZS5hbHBoYSA6IGFscGhhXHJcbiAgICAgICAgcmV0dXJuIHBvaW50XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgbGlzdCBvZiBwb2ludHNcclxuICAgICAqIEBwYXJhbSB7KG51bWJlcltdfFBJWEkuUG9pbnRbXXxQSVhJLlBvaW50TGlrZVtdKX0gcG9pbnRzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKi9cclxuICAgIHBvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChpc05hTihwb2ludHNbMF0pKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50KHBvaW50LngsIHBvaW50LnksIHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSAyKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50KHBvaW50c1tpXSwgcG9pbnRzW2kgKyAxXSwgdGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSBwb2ludCB1c2luZyBsaW5lU3R5bGUgb3IgcHJvdmlkZWQgdGludCBhbmQgYWxwaGFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcG9pbnQoeCwgeSwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgIHBvaW50LndpZHRoID0gcG9pbnQuaGVpZ2h0ID0gMVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpZiBsaW5lU3R5bGUud2lkdGggPiAxIHRoZW4gdXNlIHRoaXMgZGlyZWN0aW9uIHRvIHBsYWNlIHRoZSBuZXh0IGxpbmU7IGNlbnRlcj1hbHRlcm5hdGUgdXAgYW5kIGRvd25cclxuICAgICAqIEB0eXBlZGVmIHtzdHJpbmd9IExpbmVEaXJlY3Rpb24gKHVwLCBjZW50ZXIsIGRvd24pXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIHNldCBsaW5lc3R5bGUgZm9yIHBpeGVsYXRlZCBsYXllclxyXG4gICAgICogTk9URTogd2lkdGggb25seSB3b3JrcyBmb3IgbGluZSgpIGZvciBub3dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50PTB4ZmZmZmZmXVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYT0xXVxyXG4gICAgICogQHBhcmFtIHtMaW5lRGlyZWN0aW9ufSBbZGlyZWN0aW9uPXVwXSAodXAsIGNlbnRlciwgZG93bilcclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbGluZVN0eWxlKHdpZHRoLCB0aW50LCBhbHBoYSwgZGlyZWN0aW9uKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2xpbmVTdHlsZS53aWR0aCA9IHdpZHRoXHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLnRpbnQgPSB0eXBlb2YgdGludCAhPT0gJ3VuZGVmaW5lZCcgPyB0aW50IDogMHhmZmZmZmZcclxuICAgICAgICB0aGlzLl9saW5lU3R5bGUuYWxwaGEgPSB0eXBlb2YgYWxwaGEgIT09ICd1bmRlZmluZWQnID8gYWxwaGEgOiAxXHJcbiAgICAgICAgdGhpcy5fbGluZVN0eWxlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbiB8fCAndXAnXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1vdmUgY3Vyc29yIHRvIHRoaXMgbG9jYXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBtb3ZlVG8oeCwgeSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmN1cnNvci54ID0geFxyXG4gICAgICAgIHRoaXMuY3Vyc29yLnkgPSB5XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgYW5kIG1vdmUgY3Vyc29yIHRvIHRoZSBzZWNvbmQgcG9pbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbGluZVdpZHRoXVxyXG4gICAgICogQHBhcmFtIHtMaW5lRGlyZWN0aW9ufSBbbGluZURpcmVjdGlvbl1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgbGluZSh4MCwgeTAsIHgxLCB5MSwgdGludCwgYWxwaGEsIGxpbmVXaWR0aCwgbGluZURpcmVjdGlvbilcclxuICAgIHtcclxuICAgICAgICBsaW5lV2lkdGggPSB0eXBlb2YgbGluZVdpZHRoID09PSAndW5kZWZpbmVkJyA/IHRoaXMuX2xpbmVTdHlsZS53aWR0aCA6IGxpbmVXaWR0aFxyXG4gICAgICAgIGxpbmVEaXJlY3Rpb24gPSBsaW5lRGlyZWN0aW9uIHx8IHRoaXMuX2xpbmVTdHlsZS5kaXJlY3Rpb25cclxuICAgICAgICBpZiAobGluZVdpZHRoID09PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHRoaXMubGluZVBvaW50cyh4MCwgeTAsIHgxLCB5MSksIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IEFuZ2xlLmFuZ2xlVHdvUG9pbnRzKHgwLCB5MCwgeDEsIHkxKSArIE1hdGguUEkgLyAyICogKGxpbmVEaXJlY3Rpb24gPT09ICd1cCcgPyAtMSA6IDEpXHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ2xlKVxyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSlcclxuICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICAgICAgaWYgKGxpbmVEaXJlY3Rpb24gPT09ICdjZW50ZXInKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoYWxmID0gbGluZVdpZHRoIC8gMlxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDAgKyBNYXRoLnJvdW5kKGNvcyAqIGhhbGYpLCB5MCArIE1hdGgucm91bmQoc2luICogaGFsZikpXHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSArIE1hdGgucm91bmQoY29zICogaGFsZiksIHkxICsgTWF0aC5yb3VuZChzaW4gKiBoYWxmKSlcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHgxIC0gTWF0aC5yb3VuZChjb3MgKiBoYWxmKSwgeTEgLSBNYXRoLnJvdW5kKHNpbiAqIGhhbGYpKVxyXG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2goeDAgLSBNYXRoLnJvdW5kKGNvcyAqIGhhbGYpLCB5MCAtIE1hdGgucm91bmQoc2luICogaGFsZikpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MCwgeTApXHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MCArIE1hdGgucm91bmQoY29zICogbGluZVdpZHRoKSwgeTAgKyBNYXRoLnJvdW5kKHNpbiAqIGxpbmVXaWR0aCkpXHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSArIE1hdGgucm91bmQoY29zICogbGluZVdpZHRoKSwgeTEgKyBNYXRoLnJvdW5kKHNpbiAqIGxpbmVXaWR0aCkpXHJcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaCh4MSwgeTEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wb2x5Z29uRmlsbChwb2ludHMsIHRpbnQsIGFscGhhLCAxKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhIHBpeGVsYXRlZCBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBhbmQgbW92ZSBjdXJzb3IgdG8gdGhlIHNlY29uZCBwb2ludFxyXG4gICAgICogYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL21hZGJlbmNlL25vZGUtYnJlc2VuaGFtL2Jsb2IvbWFzdGVyL2luZGV4LmpzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geTBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkxXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBbcG9pbnRzXVxyXG4gICAgICogQHJldHVybnMge251bWJlcltdfVxyXG4gICAgICovXHJcbiAgICBsaW5lUG9pbnRzKHgwLCB5MCwgeDEsIHkxLCBwb2ludHMpXHJcbiAgICB7XHJcbiAgICAgICAgcG9pbnRzID0gcG9pbnRzIHx8IFtdXHJcbiAgICAgICAgcG9pbnRzLnB1c2goW3gwLCB5MF0pXHJcbiAgICAgICAgdmFyIGR4ID0geDEgLSB4MDtcclxuICAgICAgICB2YXIgZHkgPSB5MSAtIHkwO1xyXG4gICAgICAgIHZhciBhZHggPSBNYXRoLmFicyhkeCk7XHJcbiAgICAgICAgdmFyIGFkeSA9IE1hdGguYWJzKGR5KTtcclxuICAgICAgICB2YXIgZXBzID0gMDtcclxuICAgICAgICB2YXIgc3ggPSBkeCA+IDAgPyAxIDogLTE7XHJcbiAgICAgICAgdmFyIHN5ID0gZHkgPiAwID8gMSA6IC0xO1xyXG4gICAgICAgIGlmIChhZHggPiBhZHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0geDAsIHkgPSB5MDsgc3ggPCAwID8geCA+PSB4MSA6IHggPD0geDE7IHggKz0gc3gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIGVwcyArPSBhZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGVwcyA8PCAxKSA+PSBhZHgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeSArPSBzeTtcclxuICAgICAgICAgICAgICAgICAgICBlcHMgLT0gYWR4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0geDAsIHkgPSB5MDsgc3kgPCAwID8geSA+PSB5MSA6IHkgPD0geTE7IHkgKz0gc3kpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgICAgIGVwcyArPSBhZHg7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGVwcyA8PCAxKSA+PSBhZHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCArPSBzeDtcclxuICAgICAgICAgICAgICAgICAgICBlcHMgLT0gYWR5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwb2ludHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIHVuaXF1ZSBhcnJheVxyXG4gICAgICogZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTIyOTgyMS8xOTU1OTk3XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYVxyXG4gICAgICovXHJcbiAgICBoYXNoVW5pcXVlKGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3Qgc2VlbiA9IHt9XHJcbiAgICAgICAgcmV0dXJuIGEuZmlsdGVyKChpdGVtKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gaXRlbVswXSArICcuJyArIGl0ZW1bMV1cclxuICAgICAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoa2V5KSA/IGZhbHNlIDogKHNlZW5ba2V5XSA9IHRydWUpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBzZXQgb2YgcG9pbnRzLCByZW1vdmluZyBkdXBsaWNhdGVzIGZpcnN0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtvYmplY3RbXX1cclxuICAgICAqL1xyXG4gICAgZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIHBvaW50cyA9IHRoaXMuaGFzaFVuaXF1ZShwb2ludHMpXHJcbiAgICAgICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludChwb2ludFswXSwgcG9pbnRbMV0sIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYSBwaXhlbGF0ZWQgbGluZSBmcm9tIHRoZSBjdXJzb3IgcG9zaXRpb24gdG8gdGhpcyBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGxpbmVUbyh4LCB5KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyh0aGlzLmxpbmVQb2ludHModGhpcy5jdXJzb3IueCwgdGhpcy5jdXJzb3IueSwgeCwgeSkpXHJcbiAgICAgICAgdGhpcy5jdXJzb3IueCA9IHhcclxuICAgICAgICB0aGlzLmN1cnNvci55ID0geVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGNpcmNsZVxyXG4gICAgICogZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NaWRwb2ludF9jaXJjbGVfYWxnb3JpdGhtXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1c1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgY2lyY2xlKHgwLCB5MCwgcmFkaXVzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gcmFkaXVzXHJcbiAgICAgICAgbGV0IHkgPSAwXHJcbiAgICAgICAgbGV0IGRlY2lzaW9uT3ZlcjIgPSAxIC0geCAgIC8vIERlY2lzaW9uIGNyaXRlcmlvbiBkaXZpZGVkIGJ5IDIgZXZhbHVhdGVkIGF0IHg9ciwgeT0wXHJcblxyXG4gICAgICAgIHdoaWxlICh4ID49IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeCArIHgwLCB5ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeSArIHgwLCB4ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbLXggKyB4MCwgeSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy15ICsgeDAsIHggKyB5MF0pXHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFsteCArIHgwLCAteSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goWy15ICsgeDAsIC14ICsgeTBdKVxyXG4gICAgICAgICAgICBwb2ludHMucHVzaChbeCArIHgwLCAteSArIHkwXSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3kgKyB4MCwgLXggKyB5MF0pXHJcbiAgICAgICAgICAgIHkrK1xyXG4gICAgICAgICAgICBpZiAoZGVjaXNpb25PdmVyMiA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiB5ICsgMSAvLyBDaGFuZ2UgaW4gZGVjaXNpb24gY3JpdGVyaW9uIGZvciB5IC0+IHkrMVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeC0tXHJcbiAgICAgICAgICAgICAgICBkZWNpc2lvbk92ZXIyICs9IDIgKiAoeSAtIHgpICsgMSAvLyBDaGFuZ2UgZm9yIHkgLT4geSsxLCB4IC0+IHgtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGFuZCBmaWxsIGNpcmNsZVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggY2VudGVyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSBjZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqL1xyXG4gICAgY2lyY2xlRmlsbCh4MCwgeTAsIHJhZGl1cywgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBsZXQgeCA9IHJhZGl1c1xyXG4gICAgICAgIGxldCB5ID0gMFxyXG4gICAgICAgIGxldCBkZWNpc2lvbk92ZXIyID0gMSAtIHggICAvLyBEZWNpc2lvbiBjcml0ZXJpb24gZGl2aWRlZCBieSAyIGV2YWx1YXRlZCBhdCB4PXIsIHk9MFxyXG5cclxuICAgICAgICB3aGlsZSAoeCA+PSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKC14ICsgeDAsIHkgKyB5MCwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteSArIHgwLCB4ICsgeTAsIHkgKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoLXggKyB4MCwgLXkgKyB5MCwgeCAqIDIgKyAxLCAxLCBwb2ludHMpXHJcbiAgICAgICAgICAgIHRoaXMucmVjdFBvaW50cygteSArIHgwLCAteCArIHkwLCB5ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgeSsrXHJcbiAgICAgICAgICAgIGlmIChkZWNpc2lvbk92ZXIyIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqIHkgKyAxIC8vIENoYW5nZSBpbiBkZWNpc2lvbiBjcml0ZXJpb24gZm9yIHkgLT4geSsxXHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4LS1cclxuICAgICAgICAgICAgICAgIGRlY2lzaW9uT3ZlcjIgKz0gMiAqICh5IC0geCkgKyAxIC8vIENoYW5nZSBmb3IgeSAtPiB5KzEsIHggLT4geC0xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXR1cm4gYW4gYXJyYXkgb2YgcG9pbnRzIGZvciBhIHJlY3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geDBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcltdfSBbcG9pbnRzXVxyXG4gICAgICogQHJldHVybnMge29iamVjdFtdfVxyXG4gICAgICovXHJcbiAgICByZWN0UG9pbnRzKHgwLCB5MCwgd2lkdGgsIGhlaWdodCwgcG9pbnRzKVxyXG4gICAge1xyXG4gICAgICAgIHBvaW50cyA9IHBvaW50cyB8fCBbXVxyXG4gICAgICAgIGZvciAobGV0IHkgPSB5MDsgeSA8IHkwICsgaGVpZ2h0OyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0geDA7IHggPCB4MCArIHdpZHRoOyB4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKFt4LCB5XSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcG9pbnRzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IHRoZSBvdXRsaW5lIG9mIGEgcmVjdFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgICAqIEByZXR1cm4ge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICByZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGlmICh3aWR0aCA9PT0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgcG9pbnQucG9zaXRpb24uc2V0KHgsIHkpXHJcbiAgICAgICAgICAgIHBvaW50LndpZHRoID0gMVxyXG4gICAgICAgICAgICBwb2ludC5oZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGVpZ2h0ID09PSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICBwb2ludC5wb3NpdGlvbi5zZXQoeCwgeSlcclxuICAgICAgICAgICAgcG9pbnQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHBvaW50LmhlaWdodCA9IDFcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgdG9wID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgdG9wLnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgICAgICB0b3Aud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICAgICAgdG9wLmhlaWdodCA9IDFcclxuICAgICAgICAgICAgY29uc3QgYm90dG9tID0gdGhpcy5nZXRQb2ludCh0aW50LCBhbHBoYSlcclxuICAgICAgICAgICAgYm90dG9tLnBvc2l0aW9uLnNldCh4LCB5ICsgaGVpZ2h0KVxyXG4gICAgICAgICAgICBib3R0b20ud2lkdGggPSB3aWR0aCArIDFcclxuICAgICAgICAgICAgYm90dG9tLmhlaWdodCA9IDFcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMuZ2V0UG9pbnQodGludCwgYWxwaGEpXHJcbiAgICAgICAgICAgIGxlZnQucG9zaXRpb24uc2V0KHgsIHkgKyAxKVxyXG4gICAgICAgICAgICBsZWZ0LndpZHRoID0gMVxyXG4gICAgICAgICAgICBsZWZ0LmhlaWdodCA9IGhlaWdodCAtIDFcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgICAgICByaWdodC5wb3NpdGlvbi5zZXQoeCArIHdpZHRoLCB5ICsgMSlcclxuICAgICAgICAgICAgcmlnaHQud2lkdGggPSAxXHJcbiAgICAgICAgICAgIHJpZ2h0LmhlaWdodCA9IGhlaWdodCAtIDFcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgcmVjdGFuZ2xlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW50XVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbHBoYV1cclxuICAgICAqIEByZXR1cm5zIHtQaXhlbGF0ZX1cclxuICAgICAqL1xyXG4gICAgcmVjdEZpbGwoeCwgeSwgd2lkdGgsIGhlaWdodCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLmdldFBvaW50KHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHBvaW50LnBvc2l0aW9uLnNldCh4LCB5KVxyXG4gICAgICAgIHBvaW50LndpZHRoID0gd2lkdGggKyAxXHJcbiAgICAgICAgcG9pbnQuaGVpZ2h0ID0gaGVpZ2h0ICsgMVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIGVsbGlwc2VcclxuICAgICAqIGZyb20gaHR0cDovL2NmZXRjaC5ibG9nc3BvdC50dy8yMDE0LzAxL3dhcC10by1kcmF3LWVsbGlwc2UtdXNpbmctbWlkcG9pbnQuaHRtbFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhjIGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHljIGNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ4IC0gcmFkaXVzIHgtYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJ5IC0gcmFkaXVzIHktYXhpc1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAgICogQHJldHVybnMge1BpeGVsYXRlfVxyXG4gICAgICovXHJcbiAgICBlbGxpcHNlKHhjLCB5YywgcngsIHJ5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gMCwgeSA9IHJ5XHJcbiAgICAgICAgbGV0IHAgPSAocnkgKiByeSkgLSAocnggKiByeCAqIHJ5KSArICgocnggKiByeCkgLyA0KVxyXG4gICAgICAgIHdoaWxlICgoMiAqIHggKiByeSAqIHJ5KSA8ICgyICogeSAqIHJ4ICogcngpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgLSB5XSlcclxuXHJcbiAgICAgICAgICAgIGlmIChwIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpICsgKHJ5ICogcnkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgKyAoMiAqIHJ5ICogcnkgKiB4ICsgcnkgKiByeSkgLSAoMiAqIHJ4ICogcnggKiB5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHAgPSAoeCArIDAuNSkgKiAoeCArIDAuNSkgKiByeSAqIHJ5ICsgKHkgLSAxKSAqICh5IC0gMSkgKiByeCAqIHJ4IC0gcnggKiByeCAqIHJ5ICogcnlcclxuICAgICAgICB3aGlsZSAoeSA+PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjICsgeCwgeWMgKyB5XSlcclxuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3hjIC0geCwgeWMgLSB5XSlcclxuICAgICAgICAgICAgaWYgKHAgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB5ID0geSAtIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwIC0gKDIgKiByeCAqIHJ4ICogeSkgKyAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHgpIC0gKDIgKiByeCAqIHJ4ICogeSkgLSAocnggKiByeClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhbmQgZmlsbCBlbGxpcHNlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geGMgLSB4LWNlbnRlclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHljIC0geS1jZW50ZXJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeCAtIHJhZGl1cyB4LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByeSAtIHJhZGl1cyB5LWF4aXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW50XHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGVsbGlwc2VGaWxsKHhjLCB5YywgcngsIHJ5LCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBjb25zdCBwb2ludHMgPSBbXVxyXG4gICAgICAgIGxldCB4ID0gMCwgeSA9IHJ5XHJcbiAgICAgICAgbGV0IHAgPSAocnkgKiByeSkgLSAocnggKiByeCAqIHJ5KSArICgocnggKiByeCkgLyA0KVxyXG4gICAgICAgIHdoaWxlICgoMiAqIHggKiByeSAqIHJ5KSA8ICgyICogeSAqIHJ4ICogcngpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgLSB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgdGhpcy5yZWN0UG9pbnRzKHhjIC0geCwgeWMgKyB5LCB4ICogMiArIDEsIDEsIHBvaW50cylcclxuICAgICAgICAgICAgaWYgKHAgPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgKyAocnkgKiByeSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMVxyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICBwID0gcCArICgyICogcnkgKiByeSAqIHggKyByeSAqIHJ5KSAtICgyICogcnggKiByeCAqIHkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcCA9ICh4ICsgMC41KSAqICh4ICsgMC41KSAqIHJ5ICogcnkgKyAoeSAtIDEpICogKHkgLSAxKSAqIHJ4ICogcnggLSByeCAqIHJ4ICogcnkgKiByeVxyXG4gICAgICAgIHdoaWxlICh5ID49IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyAtIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICB0aGlzLnJlY3RQb2ludHMoeGMgLSB4LCB5YyArIHksIHggKiAyICsgMSwgMSwgcG9pbnRzKVxyXG4gICAgICAgICAgICBpZiAocCA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5IC0gMVxyXG4gICAgICAgICAgICAgICAgcCA9IHAgLSAoMiAqIHJ4ICogcnggKiB5KSArIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgLSAxXHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDFcclxuICAgICAgICAgICAgICAgIHAgPSBwICsgKDIgKiByeSAqIHJ5ICogeCkgLSAoMiAqIHJ4ICogcnggKiB5KSAtIChyeCAqIHJ4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50cyhwb2ludHMsIHRpbnQsIGFscGhhKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBkcmF3IGEgcGl4ZWxhdGVkIHBvbHlnb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IHZlcnRpY2VzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHBvbHlnb24odmVydGljZXMsIHRpbnQsIGFscGhhKVxyXG4gICAge1xyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkgKz0gMilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGluZVBvaW50cyh2ZXJ0aWNlc1tpIC0gMl0sIHZlcnRpY2VzW2kgLSAxXSwgdmVydGljZXNbaV0sIHZlcnRpY2VzW2kgKyAxXSwgcG9pbnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMl0gIT09IHZlcnRpY2VzWzBdIHx8IHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDFdICE9PSB2ZXJ0aWNlc1sxXSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGluZVBvaW50cyh2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAyXSwgdmVydGljZXNbdmVydGljZXMubGVuZ3RoIC0gMV0sIHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSwgcG9pbnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGRyYXcgYW5kIGZpbGwgcGl4ZWxhdGVkIHBvbHlnb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyW119IHZlcnRpY2VzXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIHBvbHlnb25GaWxsKHZlcnRpY2VzLCB0aW50LCBhbHBoYSlcclxuICAgIHtcclxuICAgICAgICBmdW5jdGlvbiBtb2QobiwgbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKG4gJSBtKSArIG0pICUgbVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW11cclxuICAgICAgICBjb25zdCBlZGdlcyA9IFtdLCBhY3RpdmUgPSBbXVxyXG4gICAgICAgIGxldCBtaW5ZID0gSW5maW5pdHksIG1heFkgPSAwXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpICs9IDIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBwMSA9IHsgeDogdmVydGljZXNbaV0sIHk6IHZlcnRpY2VzW2kgKyAxXSB9XHJcbiAgICAgICAgICAgIGNvbnN0IHAyID0geyB4OiB2ZXJ0aWNlc1ttb2QoaSArIDIsIHZlcnRpY2VzLmxlbmd0aCldLCB5OiB2ZXJ0aWNlc1ttb2QoaSArIDMsIHZlcnRpY2VzLmxlbmd0aCldIH1cclxuICAgICAgICAgICAgaWYgKHAxLnkgLSBwMi55ICE9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0ge31cclxuICAgICAgICAgICAgICAgIGVkZ2UucDEgPSBwMVxyXG4gICAgICAgICAgICAgICAgZWRnZS5wMiA9IHAyXHJcbiAgICAgICAgICAgICAgICBpZiAocDEueSA8IHAyLnkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5ZID0gcDEueVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UubWluWCA9IHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLm1pblkgPSBwMi55XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZS5taW5YID0gcDIueFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbWluWSA9IChlZGdlLm1pblkgPCBtaW5ZKSA/IGVkZ2UubWluWSA6IG1pbllcclxuICAgICAgICAgICAgICAgIGVkZ2UubWF4WSA9IE1hdGgubWF4KHAxLnksIHAyLnkpXHJcbiAgICAgICAgICAgICAgICBtYXhZID0gKGVkZ2UubWF4WSA+IG1heFkpID8gZWRnZS5tYXhZIDogbWF4WVxyXG4gICAgICAgICAgICAgICAgaWYgKHAxLnggLSBwMi54ID09PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2Uuc2xvcGUgPSBJbmZpbml0eVxyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2UuYiA9IHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLnNsb3BlID0gKHAxLnkgLSBwMi55KSAvIChwMS54IC0gcDIueClcclxuICAgICAgICAgICAgICAgICAgICBlZGdlLmIgPSBwMS55IC0gZWRnZS5zbG9wZSAqIHAxLnhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVkZ2VzLnB1c2goZWRnZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlZGdlcy5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhLm1pblkgLSBiLm1pblkgfSlcclxuICAgICAgICBmb3IgKGxldCB5ID0gbWluWTsgeSA8PSBtYXhZOyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVkZ2VzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlID0gZWRnZXNbaV1cclxuICAgICAgICAgICAgICAgIGlmIChlZGdlLm1pblkgPT09IHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZWRnZSlcclxuICAgICAgICAgICAgICAgICAgICBlZGdlcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgICAgICBpLS1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZS5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWRnZSA9IGFjdGl2ZVtpXVxyXG4gICAgICAgICAgICAgICAgaWYgKGVkZ2UubWF4WSA8IHkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGktLVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGdlLnNsb3BlICE9PSBJbmZpbml0eSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2UueCA9IE1hdGgucm91bmQoKHkgLSBlZGdlLmIpIC8gZWRnZS5zbG9wZSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRnZS54ID0gZWRnZS5iXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFjdGl2ZS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhLnggLSBiLnggPT09IDAgPyBiLm1heFkgLSBhLm1heFkgOiBhLnggLSBiLnggfSlcclxuICAgICAgICAgICAgbGV0IGJpdCA9IHRydWUsIGN1cnJlbnQgPSAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBhY3RpdmVbMF0ueDsgeCA8PSBhY3RpdmVbYWN0aXZlLmxlbmd0aCAtIDFdLng7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJpdClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlW2N1cnJlbnRdLnggPT09IHgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVtjdXJyZW50XS5tYXhZICE9PSB5KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYml0ID0gIWJpdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50KytcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYXdQb2ludHMocG9pbnRzLCB0aW50LCBhbHBoYSlcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZHJhdyBhcmNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4MCAtIHgtc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5MCAtIHktc3RhcnRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSByYWRpdXNcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBhbmdsZSAocmFkaWFucylcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgYW5nbGUgKHJhZGlhbnMpXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGludFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFscGhhXHJcbiAgICAgKiBAcmV0dXJucyB7UGl4ZWxhdGV9XHJcbiAgICAgKi9cclxuICAgIGFyYyh4MCwgeTAsIHJhZGl1cywgc3RhcnQsIGVuZCwgdGludCwgYWxwaGEpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBNYXRoLlBJIC8gcmFkaXVzIC8gNFxyXG4gICAgICAgIGNvbnN0IHBvaW50cyA9IFtdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSArPSBpbnRlcnZhbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFtNYXRoLmZsb29yKHgwICsgTWF0aC5jb3MoaSkgKiByYWRpdXMpLCBNYXRoLmZsb29yKHkwICsgTWF0aC5zaW4oaSkgKiByYWRpdXMpXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmF3UG9pbnRzKHBvaW50cywgdGludCwgYWxwaGEpXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGVtcHRpZXMgY2FjaGUgb2Ygb2xkIHNwcml0ZXNcclxuICAgICAqL1xyXG4gICAgZmx1c2goKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXVxyXG4gICAgfVxyXG59XHJcblxyXG5QaXhlbGF0ZS5fdGV4dHVyZSA9IFBJWEkuVGV4dHVyZS5XSElURVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaXhlbGF0ZSJdfQ==